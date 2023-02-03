import { createSelector } from '@ngrx/store';
import { selectAppState } from 'src/app/store/app.selector';
import { PendingTxState, pendingTxStateKey } from './pendingtx.reducer';

export const pendingTxState = (state: any): PendingTxState => state[pendingTxStateKey];

export const pendingTxSelector = createSelector(selectAppState, pendingTxState, (state, pendingTx) => ({
  pendingTx: pendingTx.pendingTransactions[state.chainData.chainId],
  chainId: state.chainData.chainId,
}));
