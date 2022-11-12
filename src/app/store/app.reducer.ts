import { ActionReducer, ActionReducerMap, createReducer, on } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';
import { IAppConfig } from '../types';
import * as Actions from './app.actions';

export const appStateKey = 'appState';

export interface AppState {
  appConfig: IAppConfig;
}

export const initialState: AppState = {
  appConfig: {
    darkmode: 'light',
  },
};

const appConfigReducer = createReducer(
  initialState.appConfig,
  on(Actions.setDarkMode, (state, action) => ({
    ...state,
    darkmode: action.theme,
  }))
);

export const reducers: ActionReducerMap<AppState> = {
  appConfig: appConfigReducer,
};

export function localStorageSyncReducer(actionReducer: ActionReducer<AppState>): ActionReducer<AppState> {
  return localStorageSync({
    keys: [],
    rehydrate: true,
  })(actionReducer);
}
