import { ActionReducerMap, createReducer, on } from '@ngrx/store';
import { IContractState, IDapp } from 'src/types/abi';
import * as Actions from './contract.actions';

export const contractStateKey = 'contractState';

export interface ContractState {
  contract?: IDapp;
  state: IContractState;
}

export const initialState: ContractState = {
  contract: undefined,
  state: {},
};

const contractReducer = createReducer(
  initialState.contract,
  on(Actions.setContract, (state, action) => action.contract)
);

const stateReducer = createReducer(
  initialState.state,
  on(Actions.getContractState, (_) => ({})),
  on(Actions.setContractState, (_, action) => action.state)
);

export const contractStateReducer: ActionReducerMap<ContractState> = {
  contract: contractReducer,
  state: stateReducer,
};
