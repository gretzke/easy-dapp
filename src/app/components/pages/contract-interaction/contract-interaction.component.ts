import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faFloppyDisk, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { ethers } from 'ethers';
import { Subscription } from 'rxjs';
import { ContractBuilder } from 'src/app/services/contract/ContractBuilder';
import { EthereumService } from 'src/app/services/ethereum.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { getDapp } from 'src/app/store/app.actions';
import { walletSelector } from 'src/app/store/app.selector';
import { ABIItem, IDapp } from 'src/types/abi';
import { createDapp, getContractState } from './store/contract.actions';
import { contractSelector } from './store/contract.selector';

@Component({
  selector: 'app-contract-interaction',
  templateUrl: './contract-interaction.component.html',
  styleUrls: ['./contract-interaction.component.scss'],
})
export class ContractInteractionComponent implements OnInit, OnDestroy {
  @Input() public firstDeployment = false;
  public faFloppyDisk = faFloppyDisk;
  public faPenToSquare = faPenToSquare;
  public read = true;
  public edit = false;
  public contractBuilder?: ContractBuilder;
  public readFunctions?: ABIItem[];
  public writeFunctions?: ABIItem[];
  public contract?: IDapp;
  public urlError = '';
  public user = '';
  private subscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private store: Store<{}>,
    private ethereum: EthereumService,
    private firebase: FirebaseService
  ) {
    this.subscription = this.store.select(contractSelector).subscribe((contract) => {
      if (contract) {
        this.contract = contract;
        this.contractBuilder = this.ethereum.getContractInstance(contract.address, contract.abi);
        this.readFunctions = this.contractBuilder.readFunctions;
        this.writeFunctions = this.contractBuilder.writeFunctions;
        this.store.dispatch(getContractState({ src: ContractInteractionComponent.name }));
      }
    });
    this.subscription.add(
      this.store.select(walletSelector).subscribe((wallet) => {
        if (wallet) {
          this.user = wallet.address;
        }
      })
    );
  }

  ngOnInit(): void {
    if (!this.firstDeployment) {
      const id = this.id(this.route.snapshot.params.owner, this.route.snapshot.params.url);
      this.store.dispatch(getDapp({ src: ContractInteractionComponent.name, id }));
    }
  }

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
    if (this.firstDeployment) {
      if (this.urlError !== '') return;
      this.store.dispatch(createDapp({ src: ContractInteractionComponent.name, contract: this.contract! }));
    }
  }

  private id(owner: string, url: string) {
    return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(owner + url));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
