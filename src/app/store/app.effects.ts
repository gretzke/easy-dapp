import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { catchError, concatMap, map, mergeMap, of, tap, withLatestFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { chains } from 'src/helpers/chainConfig';
import { getErrorMessage, handleError } from 'src/helpers/errorMessages';
import { DappService, IAbiResponse, IMessageResponse, IVerificationResponse } from '../../types/api';
import { contractSelector } from '../components/pages/contract-interaction/store/contract.selector';
import { FirebaseService } from '../services/dapps/firebase.service';
import { LocalDappService } from '../services/dapps/local-dapp.service';
import { localModeSelector } from '../services/dapps/store/dapps.selector';
import { EthereumService } from '../services/ethereum.service';
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
  requestChainIdChange,
  resetUser,
  resetWallet,
  setChainId,
  setDapps,
  setUser,
  setWallet,
  signMessage,
  submitSignature,
  walletChanged,
} from './app.actions';
import { chainIdSelector, userSelector, walletSelector } from './app.selector';

@Injectable()
export class AppEffects {
  constructor(
    private actions$: Actions,
    private store: Store<{}>,
    private ui: UIService,
    private router: Router,
    private firebase: FirebaseService,
    private local: LocalDappService,
    private ethereum: EthereumService,
    private notification: NotificationService,
    private ga: GoogleAnalyticsService
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
            if (
              (token === null && user !== null) ||
              (token !== null && (user === null || user.address.toLowerCase() !== action.address.toLowerCase()))
            )
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
        withLatestFrom(this.store.select(contractSelector)),
        tap(([_, contract]) => {
          if (sessionStorage.getItem('jwt') !== null) this.store.dispatch(logout({ src: AppEffects.name }));
          this.ethereum.wallet.disconnect();
          if (environment.walletType === 'web3modal' && contract && this.ethereum.provider === null) {
            this.router.navigate(['/']);
          }
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

  requestChainIdChange$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(requestChainIdChange),
        tap((action) => {
          this.ethereum.switchNetwork(action.chainId);
        })
      ),
    { dispatch: false }
  );

  setChainId$ = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(setChainId),
        withLatestFrom(this.store.select(contractSelector)),
        tap(([action, contract]) => {
          if (action.chainId) {
            this.ga.event('chain_changed', 'user_action', chains[action.chainId].name, action.chainId);
          }
          if (
            environment.walletType === 'web3modal' &&
            contract &&
            contract.chainId !== action.chainId &&
            contract.chainId === action.oldChainId
          ) {
            this.router.navigate(['/']);
          }
        })
      ),
    { dispatch: false }
  );

  getDapps$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(getDapps),
      withLatestFrom(this.store.select(chainIdSelector), this.store.select(localModeSelector)),
      mergeMap(([action, chainId, localMode]) => {
        return this.getDappService(localMode)
          .getDapps(chainId, action.listType, action.pagination, action.address)
          .pipe(
            map((dapps) =>
              setDapps({
                src: AppEffects.name,
                dapps: dapps.data,
                listType: action.listType,
                total: dapps.total,
                limit: dapps.limit,
                pagination: action.pagination,
              })
            ),
            catchError((error) => of(notify({ src: AppEffects.name, notificationType: 'error', message: getErrorMessage(error.message) })))
          );
      })
    )
  );

  getAbi$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(getAbi),
      withLatestFrom(this.store.select(chainIdSelector)),
      mergeMap(([action, chainId]) =>
        this.firebase.getAbi(chainId, action.address, action.proxy).pipe(
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

  getDappService = (localMode: boolean): DappService => (localMode ? this.local : this.firebase);
}
