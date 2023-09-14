import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { faGear, faGlasses, faPen } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { ethers } from 'ethers';
import { Subscription } from 'rxjs';
import { getDapp, notify, resetDapp } from 'src/app/store/app.actions';
import { explorers } from 'src/helpers/chainConfig';
import { dappId } from 'src/helpers/util';
import { FunctionType, IDapp, IDappConfig } from 'src/types/abi';
import { getContractState, saveOrder } from './store/contract.actions';
import { configSelector, contractSelector, editSelector } from './store/contract.selector';

type tab = 'read' | 'write' | 'config';

@Component({
  selector: 'app-contract-interaction',
  templateUrl: './contract-interaction.component.html',
  styleUrls: ['./contract-interaction.component.scss'],
})
export class ContractInteractionComponent implements OnInit, OnDestroy {
  @Input() public firstDeployment = false;
  faGlasses = faGlasses;
  faPen = faPen;
  faGear = faGear;
  edit = false;
  public tab: tab = 'write';
  public moveable = false;
  public config?: IDappConfig;
  public contract?: IDapp;
  private subscription: Subscription;

  constructor(private route: ActivatedRoute, private router: Router, private store: Store<{}>, private title: Title) {
    this.subscription = this.store.select(contractSelector).subscribe((contract) => {
      this.contract = contract;
      if (contract !== undefined) {
        this.store.dispatch(getContractState({ src: ContractInteractionComponent.name }));
      }
    });

    this.subscription.add(
      this.store.select(editSelector).subscribe((edit) => {
        if (!edit && this.tab === 'config') this.tab = 'write';
        this.edit = edit;
      })
    );

    this.subscription.add(
      this.store.select(configSelector).subscribe((config) => {
        this.config = config;
        if (config?.name) {
          this.title.setTitle(config.name);
        }
      })
    );
    const path = this.route.snapshot.routeConfig?.path;
    if (path === 'new-dapp' || path === 'new-dapp/:address' || path === 'address' || path === 'address/:address') return;
    this.subscription.add(
      this.route.params.subscribe((params) => {
        this.init(params);
      })
    );
  }

  private init(params: any) {
    const owner = params.owner;
    if (!owner || !ethers.utils.isAddress(owner)) {
      this.store.dispatch(notify({ src: ContractInteractionComponent.name, message: 'Invalid url', notificationType: 'error' }));
      this.router.navigate(['/']);
      return;
    }
    if (!this.firstDeployment) {
      const id = dappId(params.owner.toLowerCase(), params.url);
      const address = params.address;
      if (address === undefined || ethers.utils.isAddress(address)) {
        this.store.dispatch(getDapp({ src: ContractInteractionComponent.name, id, address }));
      } else {
        this.store.dispatch(notify({ src: ContractInteractionComponent.name, message: 'Invalid url', notificationType: 'error' }));
        this.router.navigate(['/']);
      }
    }
  }

  ngOnInit(): void {}

  saveOrder(event: CdkDragDrop<string[]>, type: FunctionType) {
    if (!this.config) return;
    const newOrder = [...this.config[type].order];
    moveItemInArray(newOrder, event.previousIndex, event.currentIndex);
    this.store.dispatch(saveOrder({ src: ContractInteractionComponent.name, functionType: type, order: newOrder }));
    this.moveable = false;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.store.dispatch(resetDapp({ src: ContractInteractionComponent.name }));
    this.title.setTitle('EasyDapp');
  }

  public blockExplorerUrl(address: string) {
    if (!this.contract || explorers[this.contract.chainId] === undefined) return '';
    return explorers[this.contract.chainId].url + '/address/' + address;
  }
}
