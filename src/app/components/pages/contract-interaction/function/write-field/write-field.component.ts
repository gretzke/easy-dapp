import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { ABIItem, ContractDataType } from 'src/types/abi';
import { sendContractTx } from '../../store/contract.actions';

@Component({
  selector: 'app-write-field',
  templateUrl: './write-field.component.html',
  styleUrls: ['./write-field.component.scss'],
})
export class WriteFieldComponent implements OnInit {
  faChevronUp = faChevronUp;
  @Input() field?: ABIItem;
  public args: ContractDataType[] = [];

  constructor(private store: Store<{}>) {}

  ngOnInit(): void {
    this.args = new Array(this.field?.inputs.length);
  }

  public sendTx() {
    if (this.allArgsValid) {
      this.store.dispatch(sendContractTx({ src: WriteFieldComponent.name, method: this.field!.name, args: this.args }));
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

  setArg(index: number, val: ContractDataType) {
    this.args[index] = val;
  }
}
