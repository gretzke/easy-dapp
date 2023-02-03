import { createSelector } from '@ngrx/store';
import { selectAppState } from 'src/app/store/app.selector';
import { IDappConfig } from 'src/types/abi';
import { ContractState, contractStateKey } from './contract.reducer';

export const selectContractState = (state: any): ContractState => state[contractStateKey];
export const selectConfigState = (state: any): IDappConfig => state[contractStateKey].config;

export const contractSelector = createSelector(selectContractState, (state) => state.contract);

export const likedContractSelector = createSelector(selectContractState, (state) => state.contract?.liked ?? false);

export const contractStateSelector = createSelector(selectContractState, (state) => state.state);
export const configSelector = createSelector(selectContractState, (state) => state.config);

export const editSelector = createSelector(selectContractState, (state) => state.tmpConfig.edit);
export const deploymentTypeSelector = createSelector(selectAppState, selectContractState, (appState, contractState) => {
  if (contractState.tmpConfig.firstDeployment) return 'new';
  if (appState.user !== null) {
    return appState.user.address.toLowerCase() === contractState.contract?.owner.toLowerCase() ? 'save' : 'fork';
  }
  return appState.chainData.wallet?.address.toLowerCase() === contractState.contract?.owner.toLowerCase() ? 'save' : 'fork';
});
export const urlSelector = createSelector(selectContractState, (state) => state.tmpConfig.url);

export const functionConfigSelector = (signature: string) => createSelector(selectConfigState, (state) => state.functionConfig[signature]);

export const fieldSelector = (signature: string) =>
  createSelector(selectContractState, (state) => {
    const config = state.config === undefined ? undefined : state.config.functionConfig[signature];
    return {
      field: state.components.functions[signature],
      config: config,
    };
  });

export const enumComponentsSelector = createSelector(selectContractState, (state) => state.components.enums);

export const enumSelector = (name: string) => createSelector(selectContractState, (state) => state.config?.enums?.[name] ?? []);
