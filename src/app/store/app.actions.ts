import { createAction, props } from '@ngrx/store';
import { IDapps } from 'src/types/api';
import { IUser, IWallet, NotificationType, ThemeMode } from '../../types';
import { DappListType, Pagination } from './app.reducer';

export const setDarkmode = createAction('[CLIENT CONFIG] toggle dark mode', props<{ src: string; theme: ThemeMode }>());

export const requestChainIdChange = createAction('[CHAIN DATA] request chain id change', props<{ src: string; chainId: number }>());

export const setChainId = createAction('[CHAIN DATA] set chain id', props<{ src: string; chainId: number; oldChainId: number }>());

export const connectWallet = createAction('[CHAIN DATA] connect wallet', props<{ src: string }>());

export const walletChanged = createAction('[CHAIN DATA] wallet changed', props<{ src: string; address: string }>());

export const setWallet = createAction('[CHAIN DATA] set wallet', props<{ src: string; wallet: IWallet }>());

export const resetWallet = createAction('[CHAIN DATA] reset wallet', props<{ src: string }>());

export const getAbi = createAction('[FIREBASE] fetch abi', props<{ src: string; address: string; proxy: boolean }>());

export const abiResponse = createAction('[FIREBASE] abi response', props<{ src: string; abi: string; id: string; verified: boolean }>());

export const abiError = createAction('[FIREBASE] abi error', props<{ src: string; message: string; details: string }>());

export const transactionFailed = createAction('[ETHEREUM SERVICE] transaction failed', props<{ src: string; error: Error }>());

export const notify = createAction(
  '[NOTIFICATION] send notification',
  props<{ src: string; notificationType: NotificationType; message: string }>()
);

export const getDapps = createAction(
  '[FIREBASE] fetch dapps',
  props<{ src: string; listType: DappListType; persist: boolean; pagination: Pagination; address?: string }>()
);

export const setDapps = createAction(
  '[FIREBASE] set dapps',
  props<{ src: string; dapps: IDapps; listType: DappListType; total: number; limit: number; pagination: Pagination }>()
);

export const login = createAction('[AUTH] login', props<{ src: string }>());

export const signMessage = createAction('[AUTH] sign message', props<{ src: string; message: string }>());

export const submitSignature = createAction('[AUTH] submit signature', props<{ src: string; message: string; signature: string }>());

export const setUser = createAction('[AUTH] set user', props<{ src: string; user: IUser }>());

export const logout = createAction('[AUTH] logout', props<{ src: string }>());

export const resetUser = createAction('[AUTH] reset user', props<{ src: string }>());

export const getDapp = createAction('[FIREBASE] fetch dapp', props<{ src: string; id: string; address?: string }>());

export const resetDapp = createAction('[CONFIG] delete dapp from cache', props<{ src: string }>());

export const EMPTY_ACTION = createAction('[EMPTY] empty action', props<{ src: string }>());
