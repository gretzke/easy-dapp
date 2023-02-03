import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, mergeMap, Observable, of, take, tap, throwError } from 'rxjs';
import { DappListType } from 'src/app/store/app.reducer';
import { chainIdSelector, walletSelector } from 'src/app/store/app.selector';
import { dappId } from 'src/helpers/util';
import { IDapp, IDappConfig } from 'src/types/abi.d';
import { DappService, IAbiResponse, IContract, ICreateDappResponse, IDappResponse, IDappsResponse } from 'src/types/api.d';
import { createLocalDapp, deleteLocalDapp, saveLocalDapp } from './store/dapps.actions';
import { dappSelector, dappsSelector } from './store/dapps.selector';

@Injectable({
  providedIn: 'root',
})
export class LocalDappService implements DappService {
  private address?: string;

  constructor(private store: Store<{}>) {
    this.store.select(walletSelector).subscribe((wallet) => {
      this.address = wallet?.address;
    });
  }

  createDapp(contract: IContract, chainId: number): Observable<ICreateDappResponse> {
    contract = JSON.parse(JSON.stringify(contract));
    const address = contract.address.toLowerCase();
    const owner = this.address?.toLowerCase();
    const url = contract.url.replace(/\s+$/, '').replace(/ /g, '-').toLowerCase();
    const id = dappId(owner ?? '', url);
    return this.store.select(dappSelector(chainId, id)).pipe(
      take(1),
      map((dapp) => {
        if (!contract.config || !contract.config.name) {
          this.error('PARSE_ERROR', 'NAME_MISSING');
        }
        if (!owner) {
          this.error('CONNECT_WALLET');
          throw ''; // for IDE
        }

        try {
          JSON.parse(contract.abi);
        } catch (e) {
          this.error('PARSE_ERROR', 'INVALID_ABI');
        }

        if (dapp !== undefined) {
          this.error('PARSE_ERROR', 'DAPP_EXISTS');
        }

        return {
          data: { owner, url },
          action: {
            src: LocalDappService.name,
            id,
            chainId,
            address,
            abi: contract.abi,
            config: contract.config,
            owner,
            url,
            proxy: contract.proxy,
          },
        };
      }),
      tap((data) => {
        this.store.dispatch(createLocalDapp(data.action));
      })
    );
  }

  saveDapp(id: string, config: IDappConfig, chainId: number): Observable<{}> {
    this.store.dispatch(saveLocalDapp({ id, config, chainId }));
    return of({});
  }

  deleteDapp(id: string, chainId: number): Observable<{}> {
    this.store.dispatch(deleteLocalDapp({ id, chainId }));
    return of({});
  }

  getDapps(chainId: number): Observable<IDappsResponse> {
    return this.store.select(dappsSelector(chainId)).pipe(
      take(1),
      map((data) => {
        const dappsCopy = { ...data.dapps };
        const dapps = Object.keys(dappsCopy).map((key) => {
          return {
            ...dappsCopy[key],
            id: key,
            chainId,
            liked: false,
          } as IDapp;
        });
        return {
          total: data.total,
          data: dapps,
          limit: 1000000,
        };
      })
    );
  }

  getDapp(id: string, _?: string, chainId?: number): Observable<IDappResponse> {
    return this.store.select(dappSelector(chainId!, id)).pipe(
      take(1),
      map((data) => {
        if (!data) this.error('NOT_FOUND', 'DAPP_NOT_FOUND');
        return { data } as IDappResponse;
      })
    );
  }

  private error(message: string, details?: string) {
    throw new Error(JSON.stringify({ error: { message, details } }));
  }
}
