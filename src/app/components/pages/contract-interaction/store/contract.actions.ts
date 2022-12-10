import { createAction, props } from '@ngrx/store';
import { ContractDataType, IDapp, IContractState, IDappConfig } from 'src/types/abi';
import { IContract } from 'src/types/api';

export const setContract = createAction('[Contract] set contract', props<{ src: string; contract?: IDapp }>());

export const getContractState = createAction('[CONTRACT] get contract state', props<{ src: string }>());

export const setContractState = createAction('[CONTRACT] set contract state', props<{ src: string; state: IContractState }>());

export const setContractStateVariable = createAction(
  '[CONTRACT] set contract state variable',
  props<{ src: string; key: string; val: ContractDataType }>()
);

export const sendContractTx = createAction(
  '[CONTRACT] send contract tx',
  props<{ src: string; method: string; args: ContractDataType[] }>()
);

export const readContract = createAction('[CONTRACT] read contract', props<{ src: string; method: string; args: ContractDataType[] }>());

export const createDapp = createAction('[CONTRACT] create dapp', props<{ src: string; contract: IContract }>());

export const saveDapp = createAction('[CONTRACT] save dapp', props<{ src: string; id: string; config: IDappConfig }>());
