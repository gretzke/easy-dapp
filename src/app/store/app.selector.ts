import { createSelector } from '@ngrx/store';
import { IContractState } from 'src/types/abi';
import { IAppConfig, IChainData } from '../../types';
import { AppState } from './app.reducer';

export const selectAppState = (state: any): AppState => state;
export const selectAppConfigState = (state: any): IAppConfig => state.appConfig;
export const selectChainDataState = (state: any): IChainData => state.chainData;

export const darkmodeSelector = createSelector(selectAppConfigState, (state) => state.darkmode);

export const chainIdSelector = createSelector(selectChainDataState, (state) => state.chainId);

export const userChainIdSelector = createSelector(selectAppState, (state) => ({
  chainId: state.chainData.chainId,
  user: state.chainData.wallet?.address,
}));

export const walletSelector = createSelector(selectChainDataState, (state) => state.wallet);

export const chainSelector = createSelector(selectChainDataState, (state) => state);

export const dappsSelector = createSelector(selectAppState, (state) => state.dapps);

export const userSelector = createSelector(selectAppState, (state) => state.user);
