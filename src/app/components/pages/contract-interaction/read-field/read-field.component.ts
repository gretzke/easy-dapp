import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ABIItem, ContractDataType, IContractState, VariableType } from 'src/types/abi';
import { readContract } from '../store/contract.actions';
import { contractStateSelector } from '../store/contract.selector';

@Component({
  selector: '[app-read-field]',
  templateUrl: './read-field.component.html',
  styleUrls: ['./read-field.component.scss'],
  animations: [
    trigger('collapse', [
      transition(':enter', [style({ height: '0', opacity: 0 }), animate('200ms ease-in', style({ height: '*', opacity: 1 }))]),
      transition(':leave', [animate('200ms ease-in', style({ height: '0', opacity: 0 }))]),
    ]),
    trigger('iconRotation', [
      state('open', style({ transform: 'rotate(0)' })),
      state('closed', style({ transform: 'rotate(180deg)' })),
      transition('open => closed', [animate('200ms ease-in')]),
      transition('closed => open', [animate('200ms ease-in')]),
    ]),
  ],
})
export class ReadFieldComponent implements OnInit {
  faChevronUp = faChevronUp;
  @Input() field?: ABIItem;
  @Input() index = 0;
  @Input() collapsed = false;
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
