import { createAction, props } from '@ngrx/store';
import { BigNumber } from 'ethers';
import { AbiFunctions, ContractDataType, FunctionType, IContractState, IDapp, InputsConfig, OutputsConfig } from 'src/types/abi';

export const setContract = createAction('[CONTRACT] set contract', props<{ src: string; contract?: IDapp; firstDeployment?: true }>());

export const setFunctions = createAction('[CONTRACT] set functions', props<{ src: string; functions: AbiFunctions; enums: string[] }>());

export const getContractState = createAction('[CONTRACT STATE] get contract state', props<{ src: string }>());

export const setContractState = createAction('[CONTRACT STATE] set contract state', props<{ src: string; state: IContractState }>());

export const readContract = createAction(
  '[CONTRACT STATE] read contract',
  props<{ src: string; signature: string; args: ContractDataType[] }>()
);

export const setContractStateVariable = createAction(
  '[CONTRACT STATE] set contract state variable',
  props<{ src: string; signature: string; val: ContractDataType }>()
);

export const sendContractTx = createAction(
  '[CONTRACT TX] send contract tx',
  props<{ src: string; method: string; args: ContractDataType[]; opt?: { value: BigNumber } }>()
);

export const saveDapp = createAction('[CONFIG] save dapp', props<{ src: string }>());

export const deleteDapp = createAction('[CONFIG] delete dapp', props<{ src: string }>());

export const likeDapp = createAction('[CONFIG] like dapp', props<{ src: string; liked: boolean }>());

export const saveOrder = createAction('[CONFIG] save order', props<{ src: string; functionType: FunctionType; order: string[] }>());

export const setEdit = createAction('[CONFIG] set edit', props<{ src: string; edit: boolean }>());

export const setName = createAction('[CONFIG] set name', props<{ src: string; name: string }>());

export const setDescription = createAction('[CONFIG] set description', props<{ src: string; description: string }>());

export const setUrl = createAction('[CONFIG] set url', props<{ src: string; url: string }>());

export const setEnumConfig = createAction('[CONFIG] set enum config', props<{ src: string; name: string; items: string[] }>());

export const updateFunctionConfig = createAction(
  '[CONFIG] set function config',
  props<{ src: string; signature: string; key: string; value: any }>()
);

export const updateInputConfig = createAction(
  '[CONFIG] set input config',
  props<{ src: string; signature: string; index: number; length: number; config: InputsConfig }>()
);

export const updateOutputConfig = createAction(
  '[CONFIG] set output config',
  props<{ src: string; signature: string; index: number; length: number; config: OutputsConfig }>()
);
