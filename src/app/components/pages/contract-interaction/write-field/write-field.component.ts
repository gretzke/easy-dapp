import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { ABIItem, ContractDataType } from 'src/types/abi';
import { sendContractTx } from '../store/contract.actions';

@Component({
  selector: '[app-write-field]',
  templateUrl: './write-field.component.html',
  styleUrls: ['./write-field.component.scss'],
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
export class WriteFieldComponent implements OnInit {
  faChevronUp = faChevronUp;
  @Input() field?: ABIItem;
  @Input() index = 0;
  @Input() collapsed = false;
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
}
