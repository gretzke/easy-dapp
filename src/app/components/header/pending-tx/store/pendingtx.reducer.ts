import { ActionReducer, ActionReducerMap, createReducer, on } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';
import { IPendingTransaction, TransactionStatus } from 'src/types';
import * as Actions from './pendingtx.actions';

export const pendingTxStateKey = 'pendingTxState';

export interface PendingTxState {
  pendingTransactions: { [key: number]: IPendingTransaction[] };
}

export const initialState: PendingTxState = {
  pendingTransactions: {},
};

const pendingTransactionsReducer = createReducer(
  initialState.pendingTransactions,

  on(Actions.watchPendingTransaction, (state, action) => {
    const pendingTx: IPendingTransaction = {
      txHash: action.txHash,
      name: action.name,
      status: TransactionStatus.PENDING,
    };
    let newArray = [pendingTx];
    if (state[action.chainId] !== undefined) {
      newArray = newArray.concat(state[action.chainId]).splice(0, 20);
    }
    return {
      ...state,
      [action.chainId]: newArray,
    };
  }),

  on(Actions.resolvePendingTransaction, (state, action) => {
    const pendingTransactions = state[action.chainId].map((item) => {
      if (item.txHash === action.txHash) {
        return {
          ...item,
          status: action.status,
        };
      }
      return item;
    });
    return {
      ...state,
      [action.chainId]: pendingTransactions,
    };
  })
);

export const pendingTxReducer: ActionReducerMap<PendingTxState> = {
  pendingTransactions: pendingTransactionsReducer,
};

export function pendingTxLocalStorageSyncReducer(actionReducer: ActionReducer<PendingTxState>): ActionReducer<PendingTxState> {
  return localStorageSync({
    keys: ['pendingTransactions'],
    rehydrate: true,
  })(actionReducer);
}
