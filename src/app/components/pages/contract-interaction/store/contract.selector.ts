import { createSelector } from '@ngrx/store';
import { ContractState, contractStateKey } from './contract.reducer';

export const selectContractState = (state: any): ContractState => state[contractStateKey];
export const selectConfigState = (state: any): ContractState => state[contractStateKey];

export const contractSelector = createSelector(selectContractState, (state) => state.contract);
export const contractStateSelector = createSelector(selectContractState, (state) => state.state);

export const configSelector = createSelector(selectConfigState, (state) => state.config);
