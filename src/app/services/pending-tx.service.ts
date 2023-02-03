import { EventEmitter, Injectable, OnDestroy, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { interval, Subscription } from 'rxjs';
import { IPendingTransaction, TransactionStatus } from 'src/types';
import { resolvePendingTransaction } from '../components/header/pending-tx/store/pendingtx.actions';
import { pendingTxSelector } from '../components/header/pending-tx/store/pendingtx.selector';
import { notify } from '../store/app.actions';
import { EthereumService } from './ethereum.service';

@Injectable({
  providedIn: 'root',
})
export class PendingTxService {
  @Output() newTx = new EventEmitter();
  public pendingTransactions: IPendingTransaction[] = [];
  public chainId?: number;

  constructor(private store: Store<{}>, private ethereum: EthereumService) {
    this.store.select(pendingTxSelector).subscribe((tx) => {
      if (tx.pendingTx !== undefined && tx.chainId !== undefined) {
        this.pendingTransactions = tx.pendingTx;
      }
      this.chainId = tx.chainId;
    });
    interval(10000).subscribe(() => {
      this.checkPendingTxs();
    });
  }

  private async checkPendingTxs(): Promise<void> {
    if (!this.chainId || !this.ethereum.signer || !this.ethereum.signer.provider) return;
    for (const tx of this.pendingTransactions) {
      if (tx.status !== TransactionStatus.PENDING) continue;
      const receipt = await this.ethereum.transactionReceipt(tx.txHash);
      if (!receipt) continue;
      this.newTx.emit();
      if (receipt.status) {
        this.store.dispatch(
          resolvePendingTransaction({
            src: PendingTxService.name,
            txHash: tx.txHash,
            status: TransactionStatus.SUCCESSFUL,
            chainId: this.chainId,
          })
        );
        this.store.dispatch(
          notify({
            src: PendingTxService.name,
            message: 'Transaction ' + tx.txHash.slice(0, 10) + '... confirmed successfully',
            notificationType: 'success',
          })
        );
      } else {
        this.store.dispatch(
          resolvePendingTransaction({
            src: PendingTxService.name,
            txHash: tx.txHash,
            status: TransactionStatus.FAILED,
            chainId: this.chainId,
          })
        );
        this.store.dispatch(
          notify({
            src: PendingTxService.name,
            message: 'Transaction ' + tx.txHash.slice(0, 10) + '... failed',
            notificationType: 'error',
          })
        );
      }
    }
  }
}
