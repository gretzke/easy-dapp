import { Injectable } from '@angular/core';
import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { Firestore, getFirestore } from 'firebase/firestore';
import { connectFunctionsEmulator, Functions, getFunctions, httpsCallable } from 'firebase/functions';
import { from, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IDappConfig } from 'src/types/abi';
import { IContract, ICreateDappResponse } from 'src/types/api';
import { IAbiResponse, IDappResponse, IDappsResponse, IMessageResponse, IVerificationResponse } from 'src/types/api';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
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

  public getAbi(chainId: number, address: string): Observable<IAbiResponse> {
    return from(this.post('getAbi', { chainId, address }) as Promise<IAbiResponse>);
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

  public getDapps(chainId: number): Observable<IDappsResponse> {
    return from(this.post('getDapps', { chainId }) as Promise<IDappsResponse>);
  }

  public getDapp(id: string): Observable<IDappResponse> {
    return from(this.post('getDapp', { id }) as Promise<IDappResponse>);
  }

  public dappExists(id: string): Promise<{ data: boolean }> {
    return this.post('dappExists', { id }) as Promise<{ data: boolean }>;
  }

  public getAbiByDoc(docId: string) {
    const getAbiByDoc = httpsCallable(this.functions, 'getAbiByDoc');
    return getAbiByDoc({ docId });
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
