import { createAction, props } from '@ngrx/store';
import { IDappConfig } from 'src/types/abi';

export const createLocalDapp = createAction(
  '[LOCAL] Create Dapp',
  props<{
    src: string;
    id: string;
    chainId: number;
    address: string;
    abi: string;
    proxy: boolean;
    config: IDappConfig;
    owner: string;
    url: string;
  }>()
);

export const saveLocalDapp = createAction(
  '[LOCAL] Save Dapp',
  props<{
    id: string;
    chainId: number;
    config: IDappConfig;
  }>()
);

export const deleteLocalDapp = createAction(
  '[LOCAL] Delete Dapp',
  props<{
    id: string;
    chainId: number;
  }>()
);
