import { IUser } from '.';
import { IAbiData, IDapp, IDappConfig } from './abi';

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
}
