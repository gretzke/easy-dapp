import { createSelector } from '@ngrx/store';
import { dappStorageKey, DappStorageState, ILocalDapps } from './dapps.reducer';

export const selectDappStorage = (state: any): DappStorageState => state[dappStorageKey];

export const localModeSelector = createSelector(selectDappStorage, (state) => state.localMode);
export const devModeSelector = createSelector(selectDappStorage, (state) => state.dev.enabled);

export const dappsSelector = (chainId: number) =>
  createSelector(selectDappStorage, (state) => {
    return { dapps: state.dapps[chainId] ?? ({} as ILocalDapps | undefined), total: state.config.count[chainId] ?? 0 };
  });

export const dappSelector = (chainId: number, id: string) =>
  createSelector(selectDappStorage, (state) => {
    if (!state.dapps[chainId]) return undefined;
    else return state.dapps[chainId][id];
  });
