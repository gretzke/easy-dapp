import { createAction, props } from '@ngrx/store';
import { ThemeMode } from '../types';

export const setDarkMode = createAction('[CLIENT CONFIG] toggle dark mode', props<{ src: string; theme: ThemeMode }>());
