import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { faCodeFork, faFloppyDisk, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { ethers } from 'ethers';
import { Subscription } from 'rxjs';
import { FirebaseService } from 'src/app/services/firebase.service';
import { walletSelector } from 'src/app/store/app.selector';
import { IDapp } from 'src/types/abi';
import { createDapp, saveDapp } from '../store/contract.actions';

@Component({
  selector: 'app-contract-header',
  templateUrl: './contract-header.component.html',
  styleUrls: ['./contract-header.component.scss'],
})
export class ContractHeaderComponent implements OnInit, OnDestroy {
  public faFloppyDisk = faFloppyDisk;
  public faPenToSquare = faPenToSquare;
  public faCodeFork = faCodeFork;
  @Input() public firstDeployment = false;
  @Input() edit = false;
  @Input() contract?: IDapp;
  public urlError = '';
  public user = '';
  private subscription: Subscription;

  constructor(private store: Store<{}>, private firebase: FirebaseService) {
    this.subscription = this.store.select(walletSelector).subscribe((wallet) => {
      if (wallet) {
        this.user = wallet.address;
      }
    });
  }

  ngOnInit(): void {}

  setName(name: string) {
    if (!this.contract) return;
    name = name.replace(/\s+/g, ' ');
    if (this.firstDeployment) this.setUrl(name);
    this.contract = {
      ...this.contract,
      config: {
        ...this.contract.config,
        name,
      },
    };
  }

  setDescription(description: string) {
    if (!this.contract) return;
    this.contract = {
      ...this.contract,
      config: {
        ...this.contract.config,
        description,
      },
    };
  }

  async setUrl(url: string) {
    if (!this.contract) return;
    this.contract = { ...this.contract, url: url.replace(/\s+$/, '').replace(/ /g, '-').toLowerCase() };
    if ((await this.firebase.dappExists(this.id(this.user, this.contract.url))).data) {
      this.urlError = 'This URL already exists';
    } else {
      this.urlError = '';
    }
  }

  saveDapp() {
    if (!this.contract) return;
    if (this.firstDeployment) {
      if (this.urlError !== '') return;
      this.store.dispatch(createDapp({ src: ContractHeaderComponent.name, contract: this.contract }));
    } else {
      if (this.user === this.contract.owner) {
        this.store.dispatch(
          saveDapp({
            src: ContractHeaderComponent.name,
            id: this.id(this.contract.owner, this.contract.url),
            config: this.contract.config,
          })
        );
      } else {
        this.store.dispatch(createDapp({ src: ContractHeaderComponent.name, contract: this.contract }));
      }
    }
    this.edit = false;
  }

  private id(owner: string, url: string) {
    return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(owner + url));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
