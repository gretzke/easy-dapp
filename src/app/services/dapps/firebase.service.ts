import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { DappListType, Pagination } from 'src/app/store/app.reducer';
import { environment } from 'src/environments/environment';
import { IDappConfig } from 'src/types/abi.d';
import {
  DappService,
  IAbiResponse,
  IContract,
  ICreateDappResponse,
  IDappResponse,
  IDappsResponse,
  IMessageResponse,
  IVerificationResponse,
} from 'src/types/api.d';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService implements DappService {
  constructor() {}

  public getAbi(chainId: number, address: string, proxy: boolean): Observable<IAbiResponse> {
    return from(this.post('getAbi', { chainId, address, proxy }) as Promise<IAbiResponse>);
  }

  public requestMessage(address: string): Observable<IMessageResponse> {
    return from(this.post('requestMessage', { address }) as Promise<IMessageResponse>);
  }

  public submitSignature(message: string, signature: string): Observable<IVerificationResponse> {
    return from(this.post('verify', { message, signature }) as Promise<IVerificationResponse>);
  }

  public createDapp(contract: IContract, chainId: number): Observable<ICreateDappResponse> {
    return from(
      this.post('createDapp', {
        chainId,
        address: contract.address,
        abi: contract.abi,
        config: contract.config,
        url: contract.url,
      }) as Promise<ICreateDappResponse>
    );
  }

  public saveDapp(id: string, config: IDappConfig): Observable<{}> {
    return from(this.post('saveDapp', { id, config }) as Promise<{}>);
  }

  deleteDapp(id: string): Observable<{}> {
    return from(this.post('deleteDapp', { id }) as Promise<{}>);
  }

  public getDapps(chainId: number, type?: DappListType, pagination?: Pagination, address?: string): Observable<IDappsResponse> {
    return from(this.post('getDapps', { chainId, type, pagination, address }) as Promise<IDappsResponse>);
  }

  public getDapp(id: string, address?: string): Observable<IDappResponse> {
    return from(this.post('getDapp', { id, address }) as Promise<IDappResponse>);
  }

  public likeDapp(id: string, like: boolean): Observable<{}> {
    return from(this.post('likeDapp', { id, like }) as Promise<{}>);
  }

  private post(endpoint: string, body: {}): Promise<{}> {
    const token = sessionStorage.getItem('jwt');

    const config = {
      body: JSON.stringify({ data: body }),
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      } as Record<string, string>,
    };

    if (token !== null) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return fetch(environment.firebaseUrl + endpoint, config).then(async (res: Response) => {
      if (res.status === 200) return await res.json();
      else throw new Error(JSON.stringify(await res.json()));
    });
  }
}
