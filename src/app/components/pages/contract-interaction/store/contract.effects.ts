import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ContractTransaction } from 'ethers';
import { catchError, filter, from, map, mergeMap, of, take, tap, withLatestFrom } from 'rxjs';
import { watchPendingTransaction } from 'src/app/components/header/pending-tx/store/pendingtx.actions';
import { dappId, getFunctionName } from 'src/helpers/util';
import { EthereumService } from 'src/app/services/ethereum.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { getDapp, login, notify, setChainId, setUser, switchNetwork } from 'src/app/store/app.actions';
import { chainIdSelector, userSelector } from 'src/app/store/app.selector';
import { getErrorMessage } from 'src/helpers/errorMessages';
import { ContractDataType } from 'src/types/abi';
import {
  getContractState,
  readContract,
  saveDapp,
  saveOrder,
  sendContractTx,
  setContract,
  setContractState,
  setContractStateVariable,
  setName,
  setFunctions,
  setUrl,
} from './contract.actions';
import { configSelector, contractSelector, deploymentTypeSelector, urlSelector } from './contract.selector';

@Injectable()
export class ContractEffects {
  constructor(
    private actions$: Actions,
    private store: Store<{}>,
    private ethereum: EthereumService,
    private firebase: FirebaseService,
    private router: Router
  ) {}

  setContract$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(setContract),
      mergeMap((action) => {
        if (action.contract === undefined) {
          return of(setFunctions({ src: ContractEffects.name, functions: {}, enums: [] }));
        }

        const ci = this.ethereum.getContractInstance(action.contract.address, action.contract.abi);

        const readFunctions = ci.readFunctions;
        const writeFunctions = ci.writeFunctions;

        const result = [
          setFunctions({ src: ContractEffects.name, functions: { ...readFunctions, ...writeFunctions }, enums: ci.enums }),
        ] as any[];

        // set order if any items are missing
        const readOrder = [...action.contract.config.read.order];
        if (Object.keys(readFunctions).length > readOrder.length) {
          for (const signature of Object.keys(readFunctions)) {
            if (readOrder.includes(signature)) continue;
            readOrder.push(signature);
          }
          result.push(
            saveOrder({
              src: ContractEffects.name,
              functionType: 'read',
              order: readOrder,
            })
          );
        }

        const writeOrder = [...action.contract.config.write.order];
        if (Object.keys(writeFunctions).length > writeOrder.length) {
          for (const signature of Object.keys(writeFunctions)) {
            if (writeOrder.includes(signature)) continue;
            writeOrder.push(signature);
          }
          result.push(
            saveOrder({
              src: ContractEffects.name,
              functionType: 'write',
              order: writeOrder,
            })
          );
        }

        return result;
      })
    )
  );

  setName$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(setName),
      withLatestFrom(this.store.select(deploymentTypeSelector)),
      filter(([_, deploymentType]) => deploymentType !== 'save'),
      map(([action]) => setUrl({ src: ContractEffects.name, url: action.name }))
    )
  );

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
        return ci.set(action.method, action.args, action.opt).pipe(
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
        return from(ci.get(getFunctionName(action.signature), action.args)).pipe(
          map((val: ContractDataType) => setContractStateVariable({ src: ContractEffects.name, signature: action.signature, val })),
          catchError((error) => of(notify({ src: ContractEffects.name, notificationType: 'error', message: error.message })))
        );
      })
    )
  );

  saveDapp$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(saveDapp),
      withLatestFrom(
        this.store.select(userSelector),
        this.store.select(chainIdSelector),
        this.store.select(contractSelector),
        this.store.select(configSelector),
        this.store.select(deploymentTypeSelector),
        this.store.select(urlSelector)
      ),
      mergeMap(([action, user, chainId, contract, config, deployment, url]) => {
        if (user === null) {
          this.store.dispatch(login({ src: ContractEffects.name }));
          return this.actions$.pipe(
            ofType(setUser),
            mergeMap(() => of(action))
          );
        }

        const id = dappId(user.address, url);
        if (deployment === 'save') {
          return this.firebase.saveDapp(id, config!).pipe(
            map(() => notify({ src: ContractEffects.name, notificationType: 'success', message: 'Dapp saved' })),
            catchError((error) => of(notify({ src: ContractEffects.name, notificationType: 'error', message: error.message })))
          );
        } else {
          return this.firebase
            .createDapp(
              {
                address: contract!.address,
                abi: contract!.abi,
                config: config!,
                url,
              },
              chainId
            )
            .pipe(
              tap(() => this.store.dispatch(setContract({ src: ContractEffects.name, contract: undefined }))),
              tap((res) => this.router.navigate(['/app', res.data.owner, res.data.url])),
              map(() => notify({ src: ContractEffects.name, notificationType: 'success', message: 'Dapp saved' })),
              catchError((e) => {
                const error = getErrorMessage(e.message);
                return of(notify({ src: ContractEffects.name, notificationType: 'error', message: error }));
              })
            );
        }
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
