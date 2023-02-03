import { ActionReducerMap, createReducer, on } from '@ngrx/store';
import { chains } from 'src/helpers/chainConfig';
import { IDapp, IDappConfig } from 'src/types/abi';
import * as GlobalActions from '../../../store/app.actions';
import * as Actions from './dapps.actions';

export interface ILocalDapps {
  [id: string]: IDapp;
}

export const dappStorageKey = 'dappStorage';

export interface DappStorageState {
  localMode: boolean;
  dev: {
    enabled: boolean;
  };
  config: {
    count: {
      [chainId: number]: number;
    };
  };
  dapps: {
    [chainId: number]: ILocalDapps;
  };
}

export const initialState: DappStorageState = {
  localMode: true,
  dev: {
    enabled: false,
  },
  config: {
    count: {},
  },
  dapps: {},
};

const localModeReducer = createReducer(
  initialState.localMode,
  on(GlobalActions.setChainId, (_, action) => {
    return chains[action.chainId] === undefined || action.chainId === 1337 || action.chainId === 31337;
  })
);

const devReducer = createReducer(
  initialState.dev,
  on(GlobalActions.setChainId, (state, action) => {
    return { ...state, enabled: action.chainId === 1337 || action.chainId === 31337 };
  })
);

const localConfigReducer = createReducer(
  initialState.config,
  on(Actions.createLocalDapp, (state, action) => {
    let newState = { ...state };
    if (newState.count[action.chainId] === undefined) {
      newState = { ...newState, count: { ...newState.count, [action.chainId]: 0 } };
    }
    newState = {
      ...newState,
      count: {
        ...newState.count,
        [action.chainId]: newState.count[action.chainId] + 1,
      },
    };
    return newState;
  })
);

const localDappsReducer = createReducer(
  initialState.dapps,
  on(Actions.createLocalDapp, (state, action) => {
    let newState: { [chainId: number]: ILocalDapps } = { ...state };
    if (newState[action.chainId] === undefined) {
      newState = { ...newState, [action.chainId]: {} };
    }

    return {
      ...newState,
      [action.chainId]: {
        ...newState[action.chainId],
        [action.id]: {
          abi: action.abi,
          proxy: action.proxy,
          address: action.address,
          chainId: action.chainId,
          config: action.config,
          owner: action.owner,
          url: action.url,
          id: action.id,
          createdAt: new Date(),
        },
      },
    };
  }),
  on(Actions.saveLocalDapp, (state, action) => {
    let newState: { [chainId: number]: ILocalDapps } = { ...state };
    if (newState[action.chainId] === undefined) return state;
    return {
      ...newState,
      [action.chainId]: {
        ...newState[action.chainId],
        [action.id]: {
          ...newState[action.chainId][action.id],
          config: action.config,
        },
      },
    };
  }),
  on(Actions.deleteLocalDapp, (state, action) => {
    let newState: { [chainId: number]: ILocalDapps } = { ...state };
    if (newState[action.chainId] === undefined) return state;
    const newDapps = Object.keys(newState[action.chainId])
      .filter((id) => id !== action.id)
      .reduce((acc, id) => {
        acc[id] = newState[action.chainId][id] as IDapp;
        return acc;
      }, {} as ILocalDapps);
    newState[action.chainId] = newDapps;
    return newState;
  })
);

export const dappStorageReducer: ActionReducerMap<DappStorageState> = {
  localMode: localModeReducer,
  dev: devReducer,
  config: localConfigReducer,
  dapps: localDappsReducer,
};
