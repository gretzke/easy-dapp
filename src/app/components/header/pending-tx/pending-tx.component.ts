import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { chainIdSelector } from 'src/app/store/app.selector';
import { explorers } from 'src/helpers/chainConfig';
import { Explorers, IPendingTransaction } from 'src/types';
import { pendingTxSelector } from './store/pendingtx.selector';

@Component({
  selector: '[app-pending-tx]',
  templateUrl: './pending-tx.component.html',
  styleUrls: ['./pending-tx.component.scss'],
  animations: [
    trigger('opacityScale', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(.95)' }),
        animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'scale(1)' }),
        animate('75ms ease-in', style({ opacity: 0, transform: 'scale(.95)' })),
      ]),
    ]),
  ],
})
export class PendingTxComponent implements OnInit {
  public pendingTransactions: IPendingTransaction[] = [];
  public showDropdown = false;
  public chainId?: number;
  public explorers: Explorers = explorers;

  constructor(private store: Store<{}>) {
    this.store.select(pendingTxSelector).subscribe((tx) => {
      if (tx !== undefined) {
        this.pendingTransactions = tx;
      }
    });
    this.store.select(chainIdSelector).subscribe((chainId) => {
      this.chainId = chainId;
    });
  }

  ngOnInit(): void {}
}
