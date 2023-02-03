import { Injectable } from '@angular/core';
import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { Firestore, getFirestore } from 'firebase/firestore';
import { connectFunctionsEmulator, Functions, getFunctions } from 'firebase/functions';
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
  private db: Firestore;
  private functions: Functions;
  private firebaseConfig = {
    apiKey: 'AIzaSyBjcvt6HR-yYmwyjg2kRZl7_-k7fyIJou0',
    authDomain: 'easydapp-56895.firebaseapp.com',
    projectId: 'easydapp-56895',
    storageBucket: 'easydapp-56895.appspot.com',
    messagingSenderId: '690175200179',
    appId: '1:690175200179:web:27fa9b3eb922f1e2d599c6',
    measurementId: 'G-5FL4G5MEZ1',
  };

  constructor() {
    const app = initializeApp(this.firebaseConfig);
    const analytics = getAnalytics(app);
    this.db = getFirestore(app);
    this.functions = getFunctions(app, 'europe-west1');
    if (!environment.production) {
      connectFunctionsEmulator(this.functions, 'localhost', 5001);
    }
  }

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
