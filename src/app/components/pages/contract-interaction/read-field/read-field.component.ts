import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ABIItem, IContractState } from 'src/types/abi';
import { contractStateSelector } from '../store/contract.selector';

@Component({
  selector: '[app-read-field]',
  templateUrl: './read-field.component.html',
  styleUrls: ['./read-field.component.scss'],
})
export class ReadFieldComponent implements OnInit {
  @Input() field?: ABIItem;
  @Input() index = 0;
  public contractState$: Observable<IContractState | undefined>;

  constructor(private store: Store<{}>) {
    this.contractState$ = this.store.select(contractStateSelector);
  }

  ngOnInit(): void {}
}
