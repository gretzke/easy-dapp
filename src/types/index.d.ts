import { SafeResourceUrl } from '@angular/platform-browser';

export type ThemeMode = 'light' | 'dark';
export type Web3Provider = 'metamask' | 'walletconnect';
export type NotificationType = 'success' | 'info' | 'error';

export interface IWallet {
  address: string;
  img: SafeResourceUrl;
}
export interface IUser {
  address: string;
  profileId: string;
  signature: string;
}

export interface IAppConfig {
  darkmode?: ThemeMode;
}
export interface IChainData {
  chainId: number;
  wallet: IWallet | null;
}

export const enum TransactionStatus {
  PENDING,
  SUCCESSFUL,
  FAILED,
}

export interface IPendingTransaction {
  txHash: string;
  name: string;
  status: TransactionStatus;
}

export interface Explorers {
  [chainId: number]: {
    name: string;
    url: string;
  };
}

export interface NativeCurrency {
  [chainId: number]: {
    decimals: number;
    name: string;
    symbol: string;
  };
}

export type InputType = 'default' | 'enum';
export type OutputType = 'default' | 'enum' | 'timestamp' | 'decimals' | 'contract';
