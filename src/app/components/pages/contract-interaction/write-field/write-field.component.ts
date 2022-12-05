import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ABIItem, ContractDataType } from 'src/types/abi';
import { sendContractTx } from '../store/contract.actions';

@Component({
  selector: '[app-write-field]',
  templateUrl: './write-field.component.html',
  styleUrls: ['./write-field.component.scss'],
})
export class WriteFieldComponent implements OnInit {
  @Input() field?: ABIItem;
  @Input() index = 0;
  public args: ContractDataType[] = [];

  constructor(private store: Store<{}>) {}

  ngOnInit(): void {
    this.args = new Array(this.field?.inputs.length);
  }

  public sendTx() {
    if (this.allArgsValid) {
      this.store.dispatch(sendContractTx({ src: WriteFieldComponent.name, address: '', method: this.field!.name, args: this.args }));
    }
  }

  get allArgsValid(): boolean {
    for (const arg of this.args) {
      if (arg === undefined) {
        return false;
      }
    }
    return true;
  }
}
