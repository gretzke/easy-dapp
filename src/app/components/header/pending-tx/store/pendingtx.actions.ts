import { createAction, props } from '@ngrx/store';
import { TransactionStatus } from 'src/types';

export const watchPendingTransaction = createAction(
  '[ETHEREUM SERVICE] add new pending transaction with chain id',
  props<{ src: string; name: string; market?: string; txHash: string; chainId: number }>()
);
export const resolvePendingTransaction = createAction(
  '[ETHEREUM SERVICE] add result to pending transaction with chain id',
  props<{ src: string; name: string; txHash: string; status: TransactionStatus; chainId: number }>()
);
