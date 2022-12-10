import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { ethers } from 'ethers';
import { Subscription } from 'rxjs';
import { ContractBuilder } from 'src/app/services/contract/ContractBuilder';
import { EthereumService } from 'src/app/services/ethereum.service';
import { getDapp } from 'src/app/store/app.actions';
import { AbiFunctions, FunctionType, IDapp, IDappConfig } from 'src/types/abi';
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
  public edit = true;
  public contractBuilder?: ContractBuilder;
  public readFunctions: AbiFunctions = {};
  public writeFunctions: AbiFunctions = {};
  public contract?: IDapp;
  public config?: IDappConfig;
  public moveable = false;
  private subscription: Subscription;

  constructor(private route: ActivatedRoute, private store: Store<{}>, private ethereum: EthereumService) {
    this.subscription = this.store.select(contractSelector).subscribe((contract) => {
      if (contract !== undefined) {
        this.contract = contract;
        this.contractBuilder = this.ethereum.getContractInstance(contract.address, contract.abi);
        this.readFunctions = this.contractBuilder.readFunctions;
        this.writeFunctions = this.contractBuilder.writeFunctions;
        this.store.dispatch(getContractState({ src: ContractInteractionComponent.name }));
      }
    });
    this.subscription.add(
      this.store.select(configSelector).subscribe((config) => {
        if (config) {
          const readOrder = [...config.read.order];
          for (const signature of Object.keys(this.readFunctions)) {
            if (readOrder.includes(signature)) continue;
            readOrder.push(signature);
          }
          if (readOrder.length !== config.read.order.length) {
            this.store.dispatch(saveOrder({ src: ContractInteractionComponent.name, functionType: 'read', order: readOrder }));
            return;
          }

          const writeOrder = [...config.write.order];
          for (const signature of Object.keys(this.writeFunctions)) {
            if (writeOrder.includes(signature)) continue;
            writeOrder.push(signature);
          }
          if (writeOrder.length !== config.write.order.length) {
            this.store.dispatch(saveOrder({ src: ContractInteractionComponent.name, functionType: 'write', order: writeOrder }));
          }
          this.config = config;
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

  drop(event: CdkDragDrop<string[]>, type: FunctionType) {
    if (!this.config) return;
    const newOrder = [...this.config[type].order];
    moveItemInArray(newOrder, event.previousIndex, event.currentIndex);
    this.store.dispatch(saveOrder({ src: ContractInteractionComponent.name, functionType: type, order: newOrder }));
    this.moveable = false;
  }

  private id(owner: string, url: string) {
    return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(owner + url));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
