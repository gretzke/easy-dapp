import { ActionReducer, ActionReducerMap, createReducer, on } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';
import { IDapps } from 'src/types/api';
import { IAppConfig, IChainData, IUser } from '../../types';
import * as Actions from './app.actions';

export const appStateKey = 'appState';

export interface AppState {
  appConfig: IAppConfig;
  chainData: IChainData;
  user: IUser | undefined;
  dapps: IDapps;
}

export const initialState: AppState = {
  appConfig: {
    darkmode: undefined,
  },
  chainData: {
    chainId: 1,
    wallet: undefined,
  },
  user: undefined,
  dapps: [],
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
    wallet: undefined,
  }))
);

const dappsReducer = createReducer(
  initialState.dapps,
  on(Actions.setDapps, (_, action) => action.dapps)
);

const userReducer = createReducer(
  initialState.user,
  on(Actions.setUser, (_, action) => action.user),
  on(Actions.resetUser, () => undefined)
);

export const reducers: ActionReducerMap<AppState> = {
  appConfig: appConfigReducer,
  chainData: chainDataReducer,
  dapps: dappsReducer,
  user: userReducer,
};

export function localStorageSyncReducer(actionReducer: ActionReducer<AppState>): ActionReducer<AppState> {
  return localStorageSync({
    keys: ['appConfig'],
    rehydrate: true,
  })(actionReducer);
}
