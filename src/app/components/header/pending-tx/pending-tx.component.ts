import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { faClipboard } from '@fortawesome/free-regular-svg-icons';
import { faCheck, faLayerGroup, faLink, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { ClipboardService } from 'ngx-clipboard';
import { Subscription } from 'rxjs';
import { PendingTxService } from 'src/app/services/pending-tx.service';
import { notify } from 'src/app/store/app.actions';
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
export class PendingTxComponent implements OnInit, OnDestroy {
  public pendingTransactions: IPendingTransaction[] = [];
  public showDropdown = false;
  public chainId?: number;
  public explorers: Explorers = explorers;
  public unreadNotifications = 0;
  private subscription = new Subscription();

  faClipboard = faClipboard;
  faLink = faLink;
  faApp = faLayerGroup;
  faCheck = faCheck;
  faXmark = faXmark;

  constructor(private store: Store<{}>, private pendingTx: PendingTxService, private clipboard: ClipboardService) {
    this.subscription.add(
      this.store.select(pendingTxSelector).subscribe((tx) => {
        this.pendingTransactions = tx.pendingTx ?? [];
        if (this.chainId !== tx.chainId) {
          this.unreadNotifications = 0;
        }
        this.chainId = tx.chainId;
      })
    );
    this.subscription.add(
      this.pendingTx.newTx.subscribe(() => {
        this.unreadNotifications++;
      })
    );
  }

  ngOnInit(): void {}

  copyTxHash(hash: string) {
    this.clipboard.copy(hash);
    this.store.dispatch(notify({ src: PendingTxComponent.name, message: 'Copied to clipboard', notificationType: 'info' }));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
