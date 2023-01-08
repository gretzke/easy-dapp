import { ActionReducerMap, createReducer, on } from '@ngrx/store';
import { AbiFunctions, IContractState, IDapp, IDappConfig } from 'src/types/abi';
import * as GlobalActions from '../../../../store/app.actions';
import * as Actions from './contract.actions';

export const contractStateKey = 'contractState';

export interface ContractState {
  contract?: IDapp;
  components: {
    functions: AbiFunctions;
    enums: string[];
  };
  config?: IDappConfig;
  state: IContractState;
  tmpConfig: {
    edit: boolean;
    firstDeployment: boolean;
    url: string;
  };
}

export const initialState: ContractState = {
  contract: undefined,
  components: {
    functions: {},
    enums: [],
  },
  config: undefined,
  state: {},
  tmpConfig: {
    edit: false,
    firstDeployment: false,
    url: '',
  },
};

const contractReducer = createReducer(
  initialState.contract,
  on(GlobalActions.getDapp, () => undefined),
  on(Actions.setContract, (_, action) => action.contract)
);

const componentsReducer = createReducer(
  initialState.components,
  on(Actions.setFunctions, (_, action) => ({ functions: action.functions, enums: action.enums }))
);

const configReducer = createReducer(
  initialState.config,
  on(Actions.setContract, (_, action) => {
    if (!action.contract) return undefined;
    let newState = { ...action.contract.config };
    if (!newState.read) {
      newState.read = {
        order: [],
      };
    } else {
      if (!newState.read.order) newState.read.order = [];
    }
    if (!newState.write) {
      newState.write = {
        order: [],
      };
    } else {
      if (!newState.write.order) newState.write.order = [];
    }
    return newState;
  }),
  on(Actions.saveOrder, (state, action) => {
    if (!state) return state;
    return { ...state, [action.functionType]: { ...state[action.functionType], order: action.order } };
  }),
  on(Actions.setName, (state, action) => {
    if (!state) return state;
    return {
      ...state,
      name: action.name.replace(/\s+/g, ' '),
    };
  }),
  on(Actions.setDescription, (state, action) => {
    if (!state) return state;
    return {
      ...state,
      description: action.description,
    };
  }),
  on(Actions.updateFunctionConfig, (state, action) => {
    if (!state) return state;
    const newConfig = state.functionConfig[action.signature] ?? {};
    return {
      ...state,
      functionConfig: {
        ...state.functionConfig,
        [action.signature]: {
          ...newConfig,
          [action.key]: action.value,
        },
      },
    };
  }),
  on(Actions.updateInputConfig, (state, action) => {
    if (!state) return state;
    const newConfig = [...(state.functionConfig[action.signature]?.inputs ?? new Array(action.length).fill({}))];
    newConfig[action.index] = action.config;
    return {
      ...state,
      functionConfig: {
        ...state.functionConfig,
        [action.signature]: {
          ...state.functionConfig[action.signature],
          inputs: newConfig,
        },
      },
    };
  }),
  on(Actions.setEnumConfig, (state, action) => {
    if (!state) return state;
    const newState = { ...state };
    if (!newState.enums) newState.enums = {};
    return {
      ...newState,
      enums: {
        ...newState.enums,
        [action.name]: action.items,
      },
    };
  })
);

const stateReducer = createReducer(
  initialState.state,
  on(Actions.getContractState, (_) => ({})),
  on(Actions.setContractState, (_, action) => action.state),
  on(Actions.setContractStateVariable, (state, action) => ({ ...state, [action.signature]: action.val }))
);

const tempConfigReducer = createReducer(
  initialState.tmpConfig,
  on(Actions.setContract, (_, action) => ({
    edit: false,
    url: action.contract?.url ?? '',
    firstDeployment: action.firstDeployment ?? false,
  })),
  // edit
  on(Actions.setEdit, (state, action) => ({ ...state, edit: action.edit })),
  on(Actions.saveDapp, (state) => ({ ...state, edit: false })),
  // url
  on(Actions.setUrl, (state, action) => ({
    ...state,
    url: action.url.replace(/\s+/g, ' ').replace(/\s+$/, '').replace(/ /g, '-').toLowerCase(),
  }))
);

export const contractStateReducer: ActionReducerMap<ContractState> = {
  contract: contractReducer,
  components: componentsReducer,
  config: configReducer,
  state: stateReducer,
  tmpConfig: tempConfigReducer,
};
