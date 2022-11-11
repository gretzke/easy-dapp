import { createSelector } from '@ngrx/store';
import { IAppConfig } from '../types';
import { AppState } from './app.reducer';

export const selectAppState = (state: any): AppState => state;
export const selectAppConfigState = (state: any): IAppConfig => state.appConfig;

export const darkModeSelector = createSelector(selectAppConfigState, (state) => state.darkmode);
