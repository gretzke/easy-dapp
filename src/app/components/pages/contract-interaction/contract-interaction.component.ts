import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { dappId } from 'src/app/helpers/util';
import { getDapp } from 'src/app/store/app.actions';
import { FunctionType, IDapp, IDappConfig } from 'src/types/abi';
import { getContractState, saveOrder } from './store/contract.actions';
import { configSelector, contractSelector } from './store/contract.selector';

@Component({
  selector: 'app-contract-interaction',
  templateUrl: './contract-interaction.component.html',
  styleUrls: ['./contract-interaction.component.scss'],
})
export class ContractInteractionComponent implements OnInit, OnDestroy {
  @Input() public firstDeployment = false;
  public read = true;
  public moveable = false;
  public config?: IDappConfig;
  public contract?: IDapp;
  private subscription: Subscription;

  constructor(private route: ActivatedRoute, private store: Store<{}>) {
    this.subscription = this.store.select(contractSelector).subscribe((contract) => {
      this.contract = contract;
      if (contract !== undefined) {
        this.store.dispatch(getContractState({ src: ContractInteractionComponent.name }));
      }
    });

    this.subscription.add(
      this.store.select(configSelector).subscribe((config) => {
        this.config = config;
      })
    );
  }

  ngOnInit(): void {
    if (!this.firstDeployment) {
      const id = dappId(this.route.snapshot.params.owner, this.route.snapshot.params.url);
      this.store.dispatch(getDapp({ src: ContractInteractionComponent.name, id }));
    }
  }

  saveOrder(event: CdkDragDrop<string[]>, type: FunctionType) {
    if (!this.config) return;
    const newOrder = [...this.config[type].order];
    moveItemInArray(newOrder, event.previousIndex, event.currentIndex);
    this.store.dispatch(saveOrder({ src: ContractInteractionComponent.name, functionType: type, order: newOrder }));
    this.moveable = false;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
