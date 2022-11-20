import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap } from 'rxjs';
import { UIService } from '../services/ui.service';
import { setUser, userChanged } from './app.actions';

@Injectable()
export class AppEffects {
  constructor(private actions$: Actions, private ui: UIService) {}

  setUser$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(userChanged),
      mergeMap((action) =>
        this.ui
          .generateProfilePicture(action.address)
          .pipe(map((img) => setUser({ src: AppEffects.name, user: { address: action.address, img } })))
      )
    )
  );
}
