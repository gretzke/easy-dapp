import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, concatMap, map, mergeMap, of, tap, withLatestFrom } from 'rxjs';
import { getErrorMessage, handleError } from 'src/helpers/errorMessages';
import { IAbiResponse, IMessageResponse, IVerificationResponse } from '../../types/api';
import { EthereumService } from '../services/ethereum.service';
import { FirebaseService } from '../services/firebase.service';
import { NotificationService } from '../services/notification.service';
import { UIService } from '../services/ui.service';
import {
  abiError,
  abiResponse,
  connectWallet,
  getAbi,
  getDapps,
  login,
  logout,
  notify,
  resetUser,
  resetWallet,
  setDapps,
  setUser,
  setWallet,
  signMessage,
  submitSignature,
  switchNetwork,
  walletChanged,
} from './app.actions';
import { chainIdSelector, userSelector, walletSelector } from './app.selector';

@Injectable()
export class AppEffects {
  constructor(
    private actions$: Actions,
    private store: Store<{}>,
    private ui: UIService,
    private firebase: FirebaseService,
    private ethereum: EthereumService,
    private notification: NotificationService
  ) {}

  connectWallet$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(connectWallet),
        tap(() => this.ethereum.connect())
      ),
    { dispatch: false }
  );

  setUser$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(walletChanged),
      withLatestFrom(this.store.select(userSelector)),
      mergeMap(([action, user]) =>
        this.ui.generateProfilePicture(action.address).pipe(
          tap(() => {
            const token = sessionStorage.getItem('jwt');
            if ((token === null && user !== null) || (token !== null && (user === null || user.address !== action.address)))
              this.store.dispatch(logout({ src: AppEffects.name }));
          }),
          map((img) => setWallet({ src: AppEffects.name, wallet: { address: action.address, img } }))
        )
      )
    )
  );

  resetWallet$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(resetWallet),
        tap(() => {
          if (sessionStorage.getItem('jwt') !== null) this.store.dispatch(logout({ src: AppEffects.name }));
        })
      ),
    { dispatch: false }
  );

  logout$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(logout),
      tap(() => sessionStorage.removeItem('jwt')),
      map(() => resetUser({ src: AppEffects.name }))
    )
  );

  setChainId$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(switchNetwork),
        tap((action) => this.ethereum.switchNetwork(action.chainId))
      ),
    { dispatch: false }
  );

  getDapps$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(getDapps),
      withLatestFrom(this.store.select(chainIdSelector)),
      mergeMap(([_, chainId]) =>
        this.firebase.getDapps(chainId).pipe(
          map((dapps) => setDapps({ src: AppEffects.name, dapps: dapps.data })),
          catchError((error) => of(notify({ src: AppEffects.name, notificationType: 'error', message: error.message })))
        )
      )
    )
  );

  getAbi$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(getAbi),
      withLatestFrom(this.store.select(chainIdSelector)),
      mergeMap(([action, chainId]) =>
        this.firebase.getAbi(chainId, action.address).pipe(
          map((res: IAbiResponse) => {
            return abiResponse({
              src: AppEffects.name,
              abi: res.data.abi,
              id: res.data.id,
              verified: res.data.verified,
            });
          }),
          catchError((e: Error) => {
            const error = handleError(e.message);
            return of(abiError({ src: AppEffects.name, message: error.message, details: error.details }));
          })
        )
      )
    )
  );

  requestMessage$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(login),
      withLatestFrom(this.store.select(walletSelector)),
      mergeMap(([action, wallet]) => {
        if (wallet === null) {
          this.store.dispatch(connectWallet({ src: AppEffects.name }));
          return this.actions$.pipe(
            ofType(setWallet),
            concatMap(() => of(action))
          );
        }
        return this.firebase.requestMessage(wallet!.address).pipe(
          map((res: IMessageResponse) => {
            return signMessage({ src: AppEffects.name, message: res.data.message });
          }),
          catchError((e: Error) => {
            const message = getErrorMessage(e.message);
            return of(notify({ src: AppEffects.name, notificationType: 'error', message }));
          })
        );
      })
    )
  );

  signMessage$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(signMessage),
      mergeMap((action) =>
        this.ethereum
          .signMessage(action.message)
          .pipe(map((signature: string) => submitSignature({ src: AppEffects.name, signature, message: action.message })))
      )
    )
  );

  submitSignature$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(submitSignature),
      mergeMap((action) =>
        this.firebase.submitSignature(action.message, action.signature).pipe(
          map((res: IVerificationResponse) => {
            sessionStorage.setItem('jwt', res.session);
            return setUser({ src: AppEffects.name, user: res.data });
          }),
          catchError((e: Error) => {
            const message = getErrorMessage(e.message);
            return of(notify({ src: AppEffects.name, notificationType: 'error', message }));
          })
        )
      )
    )
  );

  notifyError$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(notify),
        tap((action) => this.notification[action.notificationType](action.message))
      ),
    { dispatch: false }
  );
}
