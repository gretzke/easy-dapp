import { ActionReducer, ActionReducerMap, createReducer, on } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';
import { IAppConfig, IChainData } from '../../types';
import * as Actions from './app.actions';

export const appStateKey = 'appState';

export interface AppState {
  appConfig: IAppConfig;
  chainData: IChainData;
}

export const initialState: AppState = {
  appConfig: {
    darkmode: undefined,
  },
  chainData: {
    chainId: 1,
    user: undefined,
  },
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

  on(Actions.setUser, (state, action) => ({
    ...state,
    user: action.user,
  })),

  on(Actions.resetUser, (state) => ({
    ...state,
    user: undefined,
  }))
);

export const reducers: ActionReducerMap<AppState> = {
  appConfig: appConfigReducer,
  chainData: chainDataReducer,
};

export function localStorageSyncReducer(actionReducer: ActionReducer<AppState>): ActionReducer<AppState> {
  return localStorageSync({
    keys: ['appConfig'],
    rehydrate: true,
  })(actionReducer);
}
