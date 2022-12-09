import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ContractTransaction } from 'ethers';
import { catchError, concatMap, from, map, mergeMap, of, switchMap, take, tap, withLatestFrom } from 'rxjs';
import { watchPendingTransaction } from 'src/app/components/header/pending-tx/store/pendingtx.actions';
import { EthereumService } from 'src/app/services/ethereum.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { getDapp, login, notify, setChainId, setUser, switchNetwork } from 'src/app/store/app.actions';
import { chainIdSelector, userSelector, walletSelector } from 'src/app/store/app.selector';
import { ContractDataType } from 'src/types/abi';
import {
  getContractState,
  createDapp,
  sendContractTx,
  setContractState,
  setContract,
  readContract,
  setContractStateVariable,
} from './contract.actions';
import { contractSelector } from './contract.selector';

@Injectable()
export class ContractEffects {
  constructor(
    private actions$: Actions,
    private store: Store<{}>,
    private ethereum: EthereumService,
    private firebase: FirebaseService,
    private router: Router
  ) {}

  getContractState$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(getContractState),
      withLatestFrom(this.store.select(contractSelector)),
      mergeMap(([_, contract]) =>
        this.ethereum
          .getContractInstance(contract!.address, contract!.abi)
          .getContractState()
          .pipe(map((state) => setContractState({ src: ContractEffects.name, state })))
      )
    )
  );

  sendContractTx$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(sendContractTx),
      withLatestFrom(this.store.select(contractSelector)),
      mergeMap(([action, contract]) => {
        const ci = this.ethereum.getContractInstance(contract!.address, contract!.abi);
        return ci.set(action.method, action.args).pipe(
          map((tx: ContractTransaction) =>
            watchPendingTransaction({
              src: ContractEffects.name,
              name: action.method,
              txHash: tx.hash,
              chainId: ci.chainId,
            })
          ),
          catchError((error) => of(notify({ src: ContractEffects.name, notificationType: 'error', message: error.message })))
        );
      })
    )
  );

  readContract$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(readContract),
      withLatestFrom(this.store.select(contractSelector)),
      mergeMap(([action, contract]) => {
        const ci = this.ethereum.getContractInstance(contract!.address, contract!.abi);
        return from(ci.get(action.method, action.args)).pipe(
          map((val: ContractDataType) => setContractStateVariable({ src: ContractEffects.name, key: action.method, val })),
          catchError((error) => of(notify({ src: ContractEffects.name, notificationType: 'error', message: error.message })))
        );
      })
    )
  );

  createDapp$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(createDapp),
      withLatestFrom(this.store.select(chainIdSelector), this.store.select(userSelector)),
      mergeMap(([action, chainId, user]) => {
        if (user === null) {
          this.store.dispatch(login({ src: ContractEffects.name }));
          return this.actions$.pipe(
            ofType(setUser),
            concatMap(() => of(action))
          );
        }
        return this.firebase
          .createDapp(
            {
              address: action.contract.address,
              abi: action.contract.abi,
              config: action.contract.config,
              url: action.contract.url,
            },
            chainId
          )
          .pipe(
            tap(() => this.store.dispatch(setContract({ src: ContractEffects.name, contract: undefined }))),
            tap((res) => this.router.navigate(['/app', res.data.owner, res.data.url])),
            map(() => notify({ src: ContractEffects.name, notificationType: 'success', message: 'Dapp saved' })),
            catchError((error) => of(notify({ src: ContractEffects.name, notificationType: 'error', message: error.message })))
          );
      })
    )
  );

  getDapp$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(getDapp),
      withLatestFrom(this.store.select(chainIdSelector)),
      mergeMap(([action, chainId]) =>
        this.firebase.getDapp(action.id).pipe(
          mergeMap((dapp) => {
            if (dapp.data.chainId !== chainId) {
              this.store.dispatch(switchNetwork({ src: ContractEffects.name, chainId: dapp.data.chainId }));
              return this.actions$.pipe(
                ofType(setChainId),
                take(1),
                map(() => action)
              );
            }
            return of(setContract({ src: ContractEffects.name, contract: dapp.data }));
          }),
          catchError((error) => of(notify({ src: ContractEffects.name, notificationType: 'error', message: error.message })))
        )
      )
    )
  );
}
