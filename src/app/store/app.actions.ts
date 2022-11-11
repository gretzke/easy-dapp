import { createAction, props } from "@ngrx/store";

export const toggleDarkMode = createAction(
  "[CLIENT CONFIG] toggle dark mode",
  props<{ src: string }>()
);
