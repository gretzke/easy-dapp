import { createSelector } from '@ngrx/store';
import { selectAppState } from 'src/app/store/app.selector';
import { IDappConfig } from 'src/types/abi';
import { ContractState, contractStateKey } from './contract.reducer';

export const selectContractState = (state: any): ContractState => state[contractStateKey];
export const selectConfigState = (state: any): IDappConfig => state[contractStateKey].config;

export const contractSelector = createSelector(selectContractState, (state) => state.contract);
export const contractStateSelector = createSelector(selectContractState, (state) => state.state);
export const configSelector = createSelector(selectContractState, (state) => state.config);

export const editSelector = createSelector(selectContractState, (state) => state.tmpConfig.edit);
export const deploymentTypeSelector = createSelector(selectAppState, selectContractState, (appState, contractState) => {
  if (contractState.tmpConfig.firstDeployment) return 'new';
  if (appState.user !== null) {
    return appState.user.address === contractState.contract?.owner ? 'save' : 'fork';
  }
  return appState.chainData.wallet?.address === contractState.contract?.owner ? 'save' : 'fork';
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
