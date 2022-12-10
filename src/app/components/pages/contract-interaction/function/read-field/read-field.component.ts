import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ABIItem, ContractDataType, IContractState, VariableType } from 'src/types/abi';
import { readContract } from '../../store/contract.actions';
import { contractStateSelector } from '../../store/contract.selector';

@Component({
  selector: 'app-read-field',
  templateUrl: './read-field.component.html',
  styleUrls: ['./read-field.component.scss'],
})
export class ReadFieldComponent implements OnInit {
  @Input() signature: string = '';
  @Input() field?: ABIItem;
  @Input() edit = false;

  public args: ContractDataType[] = [];
  public contractState$: Observable<IContractState | undefined>;

  constructor(private store: Store<{}>) {
    this.contractState$ = this.store.select(contractStateSelector);
  }

  ngOnInit(): void {
    this.args = new Array(this.field?.inputs.length);
  }

  public sendTx() {
    if (this.allArgsValid) {
      this.store.dispatch(readContract({ src: ReadFieldComponent.name, method: this.field!.name, args: [...this.args] }));
    }
  }

  setArg(index: number, val: ContractDataType) {
    this.args[index] = val;
  }

  getValue(val: ContractDataType, type: VariableType, index: number) {
    if (/[\[\]]/.test(type.internalType)) {
      return val;
    }
    if (Array.isArray(val)) return val[index];
    return val;
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
