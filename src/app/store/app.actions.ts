import { createAction, props } from '@ngrx/store';
import { IUser, ThemeMode } from '../../types';

export const setDarkmode = createAction('[CLIENT CONFIG] toggle dark mode', props<{ src: string; theme: ThemeMode }>());

export const setChainId = createAction('[CHAIN DATA] set chain id', props<{ src: string; chainId: number }>());

export const userChanged = createAction('[CHAIN DATA] user changed', props<{ src: string; address: string }>());

export const setUser = createAction('[CHAIN DATA] set user', props<{ src: string; user: IUser }>());

export const resetUser = createAction('[CHAIN DATA] reset user', props<{ src: string }>());
