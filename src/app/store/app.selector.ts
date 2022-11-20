import { createSelector } from '@ngrx/store';
import { IAppConfig, IChainData } from '../../types';
import { AppState } from './app.reducer';

export const selectAppState = (state: any): AppState => state;
export const selectAppConfigState = (state: any): IAppConfig => state.appConfig;
export const selectChainDataState = (state: any): IChainData => state.chainData;

export const darkmodeSelector = createSelector(selectAppConfigState, (state) => state.darkmode);

export const chainIdSelector = createSelector(selectChainDataState, (state) => state.chainId);

export const userSelector = createSelector(selectChainDataState, (state) => state.user);
