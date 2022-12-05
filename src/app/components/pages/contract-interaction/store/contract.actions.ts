import { createAction, props } from '@ngrx/store';
import { ContractDataType, IDapp, IContractState } from 'src/types/abi';
import { IContract } from 'src/types/api';

export const setContract = createAction('[Contract] set contract', props<{ src: string; contract?: IDapp }>());

export const getContractState = createAction('[CONTRACT] get contract state', props<{ src: string }>());

export const setContractState = createAction('[CONTRACT] set contract state', props<{ src: string; state: IContractState }>());

export const sendContractTx = createAction(
  '[CONTRACT] send contract tx',
  props<{ src: string; address: string; method: string; args: ContractDataType[] }>()
);

export const createDapp = createAction('[CONTRACT] save dapp', props<{ src: string; contract: IContract }>());
