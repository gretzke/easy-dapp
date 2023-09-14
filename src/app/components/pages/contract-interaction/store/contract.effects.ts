import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ContractTransaction, ethers } from 'ethers';
import { catchError, filter, from, map, mergeMap, of, switchMap, take, tap, withLatestFrom } from 'rxjs';
import { watchPendingTransaction } from 'src/app/components/header/pending-tx/store/pendingtx.actions';
import { FirebaseService } from 'src/app/services/dapps/firebase.service';
import { LocalDappService } from 'src/app/services/dapps/local-dapp.service';
import { localModeSelector } from 'src/app/services/dapps/store/dapps.selector';
import { EthereumService } from 'src/app/services/ethereum.service';
import { connectWallet, getDapp, login, notify, requestChainIdChange, setChainId, setUser, setWallet } from 'src/app/store/app.actions';
import { chainIdSelector, userSelector, walletSelector } from 'src/app/store/app.selector';
import { getErrorMessage, parseEthersError } from 'src/helpers/errorMessages';
import { getFunctionName } from 'src/helpers/util';
import { ContractDataType } from 'src/types/abi';
import { DappService } from 'src/types/api';
import {
  deleteDapp,
  getContractState,
  likeDapp,
  readContract,
  saveDapp,
  saveOrder,
  sendContractTx,
  setContract,
  setContractState,
  setContractStateVariable,
  setFunctions,
  setName,
  setUrl,
} from './contract.actions';
import { configSelector, contractSelector, deploymentTypeSelector, urlSelector } from './contract.selector';
import { chainIdByName, chains } from 'src/helpers/chainConfig';

@Injectable()
export class ContractEffects {
  constructor(
    private actions$: Actions,
    private store: Store<{}>,
    private ethereum: EthereumService,
    private firebase: FirebaseService,
    private local: LocalDappService,
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
        if (readFunctions && Object.keys(readFunctions).length > readOrder.length) {
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
        if (writeFunctions && Object.keys(writeFunctions).length > writeOrder.length) {
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
      withLatestFrom(this.store.select(contractSelector), this.store.select(chainIdSelector)),
      mergeMap(([action, contract, chainId]) => {
        if (contract && contract.chainId !== chainId) {
          this.store.dispatch(requestChainIdChange({ src: ContractEffects.name, chainId: contract.chainId }));
          return this.actions$.pipe(
            ofType(setChainId),
            take(1),
            mergeMap(() => of(action))
          );
        }
        return this.ethereum
          .getContractInstance(contract!.address, contract!.abi)
          .getContractState()
          .pipe(map((state) => setContractState({ src: ContractEffects.name, state })));
      })
    )
  );

  sendContractTx$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(sendContractTx),
      withLatestFrom(this.store.select(contractSelector), this.store.select(chainIdSelector), this.store.select(walletSelector)),
      mergeMap(([action, contract, chainId, wallet]) => {
        if (contract && contract.chainId !== chainId) {
          this.store.dispatch(requestChainIdChange({ src: ContractEffects.name, chainId: contract.chainId }));
          return this.actions$.pipe(
            ofType(setChainId),
            take(1),
            mergeMap(() => of(action))
          );
        }
        if (!wallet) {
          this.store.dispatch(connectWallet({ src: ContractEffects.name }));
          return this.actions$.pipe(
            ofType(setWallet),
            take(1),
            mergeMap(() => of(action))
          );
        }
        const ci = this.ethereum.getContractInstance(contract!.address, contract!.abi);
        return ci.set(action.method, action.args, action.opt).pipe(
          map((tx: ContractTransaction) => {
            let url;
            if (contract) {
              url = contract.owner + '/' + contract.url;
              if (contract.originalAddress) {
                url += '/' + contract.address;
              }
              if (!contract.url) {
                url = undefined;
              }
            }
            return watchPendingTransaction({
              src: ContractEffects.name,
              name: action.method,
              txHash: tx.hash,
              chainId: ci.chainId,
              url,
            });
          }),
          catchError((error) => {
            const ethersError = parseEthersError(error);
            return of(notify({ src: ContractEffects.name, notificationType: 'error', message: ethersError }));
          })
        );
      })
    )
  );

  readContract$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(readContract),
      withLatestFrom(this.store.select(contractSelector), this.store.select(chainIdSelector)),
      mergeMap(([action, contract, chainId]) => {
        if (contract && contract.chainId !== chainId) {
          this.store.dispatch(requestChainIdChange({ src: ContractEffects.name, chainId: contract.chainId }));
          return this.actions$.pipe(
            ofType(setChainId),
            take(1),
            mergeMap(() => of(action))
          );
        }
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
        this.store.select(urlSelector),
        this.store.select(localModeSelector)
      ),
      switchMap(([action, user, chainId, contract, config, deployment, url, localMode]) => {
        if (user === null && !localMode) {
          this.store.dispatch(login({ src: ContractEffects.name }));
          return this.actions$.pipe(
            ofType(setUser),
            take(1),
            mergeMap(() => of(action))
          );
        }
        const dappService = this.getDappService(localMode);
        const id = contract!.id;
        if (deployment === 'save') {
          return dappService.saveDapp(id, config!, chainId).pipe(
            map(() => notify({ src: ContractEffects.name, notificationType: 'success', message: 'Dapp saved' })),
            catchError((error) =>
              of(notify({ src: ContractEffects.name, notificationType: 'error', message: getErrorMessage(error.message) }))
            )
          );
        } else {
          return dappService
            .createDapp(
              {
                address: contract!.address,
                abi: contract!.abi,
                proxy: contract!.proxy,
                config: config!,
                url,
              },
              chainId
            )
            .pipe(
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

  deleteDapp$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(deleteDapp),
      withLatestFrom(this.store.select(userSelector), this.store.select(contractSelector), this.store.select(localModeSelector)),
      switchMap(([action, user, contract, localMode]) => {
        if (user === null && !localMode) {
          this.store.dispatch(login({ src: ContractEffects.name }));
          return this.actions$.pipe(
            ofType(setUser),
            mergeMap(() => of(action))
          );
        }
        const id = contract!.id ?? '';
        const dappService = this.getDappService(localMode);
        return dappService.deleteDapp(id, contract?.chainId).pipe(
          map(() => notify({ src: ContractEffects.name, notificationType: 'success', message: 'Dapp deleted' })),
          tap(() => this.router.navigate(['/'])),
          catchError((error) =>
            of(notify({ src: ContractEffects.name, notificationType: 'error', message: getErrorMessage(error.message) }))
          )
        );
      })
    )
  );

  getDapp$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(getDapp),
      withLatestFrom(
        this.store.select(chainIdSelector),
        this.store.select(localModeSelector),
        this.store.select(walletSelector),
        this.store.select(userSelector)
      ),
      mergeMap(([action, chainId, localMode, wallet, user]) => {
        let address;
        if (!user) {
          address = wallet?.address;
        }
        return this.getDappService(localMode)
          .getDapp(action.id, address, chainId)
          .pipe(
            mergeMap((dapp) => {
              const data = { ...dapp.data };
              if (action.address && ethers.utils.isAddress(action.address)) {
                data.originalAddress = data.address;
                data.address = action.address;
              }
              if (!wallet && this.ethereum.provider === null) {
                this.store.dispatch(connectWallet({ src: ContractEffects.name }));
                return this.actions$.pipe(
                  ofType(setChainId),
                  take(1),
                  map(() => setContract({ src: ContractEffects.name, contract: data }))
                );
              }
              return of(setContract({ src: ContractEffects.name, contract: data }));
            }),
            catchError((error) =>
              of(notify({ src: ContractEffects.name, notificationType: 'error', message: getErrorMessage(error.message) }))
            )
          );
      })
    )
  );

  likeDapp$ = createEffect((): any =>
    this.actions$.pipe(
      ofType(likeDapp),
      withLatestFrom(this.store.select(userSelector), this.store.select(contractSelector)),
      mergeMap(([action, user, contract]) => {
        if (user === null) {
          this.store.dispatch(login({ src: ContractEffects.name }));
          return this.actions$.pipe(
            ofType(setUser),
            mergeMap(() => of(action))
          );
        }
        const id = contract!.id ?? '';
        return this.firebase.likeDapp(id, action.liked).pipe(
          map(() =>
            notify({ src: ContractEffects.name, notificationType: 'success', message: action.liked ? 'Liked Dapp' : 'Unliked Dapp' })
          ),
          catchError((error) =>
            of(notify({ src: ContractEffects.name, notificationType: 'error', message: getErrorMessage(error.message) }))
          )
        );
      })
    )
  );

  getDappService = (localMode: boolean): DappService => {
    return localMode ? this.local : this.firebase;
  };
}
