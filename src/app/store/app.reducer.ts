import { ActionReducer, ActionReducerMap, createReducer, on } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';
import { FirebaseDate, IDapps } from 'src/types/api';
import { IAppConfig, IChainData, IUser } from '../../types';
import { dappStorageKey } from '../services/dapps/store/dapps.reducer';
import * as Actions from './app.actions';
import { dateToMilliseconds } from '../../helpers/util';

export const appStateKey = 'appState';

export type DappListType = 'popular' | 'latest' | 'user' | 'liked';

export type PaginationType = 'next' | 'prev' | 'first';

export type Pagination = {
  type: PaginationType;
  next: any;
  prev: any[];
};

export type DappList = {
  limit: number;
  total: number;
  pagination: Pagination;
  offset: number;
  list: IDapps;
};

export interface IDappsStorage {
  [key: string]: DappList | undefined;
}

export interface AppState {
  appConfig: IAppConfig;
  chainData: IChainData;
  user: IUser | null;
  dapps: IDappsStorage;
}

export const initialState: AppState = {
  appConfig: {
    darkmode: undefined,
  },
  chainData: {
    // when chainId is set to not undefined, the app is initialized
    chainId: undefined!,
    wallet: null,
  },
  user: null,
  dapps: {},
};

const appConfigReducer = createReducer(
  initialState.appConfig,
  on(Actions.setDarkmode, (state, action) => ({ ...state, darkmode: action.theme }))
);

const chainDataReducer = createReducer(
  initialState.chainData,
  on(Actions.setChainId, (state, action) => ({
    ...state,
    chainId: action.chainId,
  })),

  on(Actions.setWallet, (state, action) => ({
    ...state,
    wallet: action.wallet,
  })),

  on(Actions.resetWallet, (state) => ({
    ...state,
    wallet: null,
  }))
);

const dappsReducer = createReducer(
  initialState.dapps,
  on(Actions.setChainId, () => ({})),
  // reset dapps if not prompted to persist
  on(Actions.getDapps, (state, action) => (action.persist ? state : { ...state, [action.listType]: undefined })),
  on(Actions.setDapps, (state, action) => {
    let offset = { ...state[action.listType] }.offset ?? 0;
    const length = action.dapps.length;
    let pagination = { ...action.pagination };

    let next;
    // get sorted by values
    if (action.listType === 'liked') {
      const timestamp = action.dapps.length > 0 ? action.dapps[length - 1].likedAt : undefined;
      next = dateToMilliseconds(timestamp);
    } else {
      next = action.dapps.length > 0 ? action.dapps[length - 1].id : undefined;
    }

    // store previous values in an array, when a user clicks back the last value from the array is used to get the previous page
    let prev = pagination.prev.length > 0 ? [...pagination.prev] : [];

    if (pagination.type === 'next') {
      prev.push(pagination.next);
      offset += action.limit;
    } else if (pagination.type === 'prev') {
      prev.pop();
      offset -= action.limit;
    } else {
      prev = [];
    }

    pagination.prev = prev;
    pagination.next = next;

    const newState: DappList = {
      ...state[action.listType],
      limit: action.limit,
      total: action.total,
      list: action.dapps,
      offset,
      pagination,
    };

    return {
      ...state,
      [action.listType]: newState,
    };
  })
);

const userReducer = createReducer(
  initialState.user,
  on(Actions.setUser, (_, action) => action.user),
  on(Actions.resetUser, () => null)
);

export const reducers: ActionReducerMap<AppState> = {
  appConfig: appConfigReducer,
  chainData: chainDataReducer,
  dapps: dappsReducer,
  user: userReducer,
};

export function localStorageSyncReducer(actionReducer: ActionReducer<AppState>): ActionReducer<AppState> {
  return localStorageSync({
    keys: ['appConfig', 'user', dappStorageKey],
    rehydrate: true,
  })(actionReducer);
}
