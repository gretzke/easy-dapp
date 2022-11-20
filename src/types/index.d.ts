import { SafeResourceUrl } from '@angular/platform-browser';

export type ThemeMode = 'light' | 'dark';
export type Web3Provider = 'metamask' | 'walletconnect';

export interface IUser {
  address: string;
  img: SafeResourceUrl;
}

export interface IAppConfig {
  darkmode?: ThemeMode;
}
export interface IChainData {
  chainId: number;
  user?: IUser;
}
