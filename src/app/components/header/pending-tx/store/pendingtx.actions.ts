import { createAction, props } from '@ngrx/store';
import { TransactionStatus } from 'src/types';

export const watchPendingTransaction = createAction(
  '[ETHEREUM SERVICE] add new pending transaction with chain id',
  props<{ src: string; name: string; txHash: string; chainId: number; url?: string }>()
);
export const resolvePendingTransaction = createAction(
  '[ETHEREUM SERVICE] add result to pending transaction with chain id',
  props<{ src: string; txHash: string; status: TransactionStatus; chainId: number }>()
);
