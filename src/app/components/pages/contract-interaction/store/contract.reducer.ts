import { ActionReducerMap, createReducer, on } from '@ngrx/store';
import { IContractState, IDapp, IDappConfig } from 'src/types/abi';
import * as Actions from './contract.actions';

export const contractStateKey = 'contractState';

export interface ContractState {
  contract?: IDapp;
  config?: IDappConfig;
  state: IContractState;
}

export const initialState: ContractState = {
  contract: undefined,
  config: undefined,
  state: {},
};

const contractReducer = createReducer(
  initialState.contract,
  on(Actions.setContract, (state, action) => action.contract)
);

const configReducer = createReducer(
  initialState.config,
  on(Actions.setContract, (_, action) => {
    if (!action.contract) return undefined;
    let newState = { ...action.contract.config };
    if (!newState.read) {
      newState.read = {
        fields: {},
        order: [],
      };
    } else {
      if (!newState.read.fields) newState.read.fields = {};
      if (!newState.read.order) newState.read.order = [];
    }
    if (!newState.write) {
      newState.write = {
        fields: {},
        order: [],
      };
    } else {
      if (!newState.write.fields) newState.write.fields = {};
      if (!newState.write.order) newState.write.order = [];
    }
    return newState;
  }),
  on(Actions.saveOrder, (state, action) => {
    if (!state) return state;
    return { ...state, [action.functionType]: { ...state[action.functionType], order: action.order } };
  })
);

const stateReducer = createReducer(
  initialState.state,
  on(Actions.getContractState, (_) => ({})),
  on(Actions.setContractState, (_, action) => action.state),
  on(Actions.setContractStateVariable, (state, action) => ({ ...state, [action.key]: action.val }))
);

export const contractStateReducer: ActionReducerMap<ContractState> = {
  contract: contractReducer,
  config: configReducer,
  state: stateReducer,
};
