import { Observable } from 'rxjs';
import { DappListType, Pagination } from 'src/app/store/app.reducer';
import { IUser } from '.';
import { IDapp, IDappConfig } from './abi';

export interface DappService {
  createDapp(contract: IContract, chainId: number): Observable<ICreateDappResponse>;

  saveDapp(id: string, config: IDappConfig, chainId?: number): Observable<{}>;

  deleteDapp(id: string, chainId?: number): Observable<{}>;

  getDapps(chainId: number, listType?: DappListType, pagination?: Pagination, address?: string): Observable<IDappsResponse>;

  getDapp(id: string, address?: string, chainId?: number): Observable<IDappResponse>;
}

export interface IAbiResponse {
  data: {
    id: string;
    abi: string;
    verified: boolean;
  };
}

export interface IMessageResponse {
  data: {
    id: string;
    message: string;
    profileId: string;
  };
}

export interface IVerificationResponse {
  data: IUser;
  session: string;
}

export interface ICreateDappResponse {
  data: {
    owner: string;
    url: string;
  };
}

export interface IDappsResponse {
  data: IDapps;
  total: number;
  limit: number;
}

export interface IDappResponse {
  data: IDapp;
}

export interface IApiError {
  message: string;
  details: string;
}

export type IDapps = IDapp[];

export interface IContract {
  address: string;
  abi: string;
  config: IDappConfig;
  url: string;
  proxy: boolean;
}

export interface FirebaseDate {
  _seconds: number;
  _nanoseconds: number;
}
