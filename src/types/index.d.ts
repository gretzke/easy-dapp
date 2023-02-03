import { SafeResourceUrl } from '@angular/platform-browser';
import { InternalType } from './abi';

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
  url?: string;
}

export interface Explorers {
  [chainId: number]: {
    name: string;
    url: string;
  };
}

export interface NativeCurrency {
  [chainId: number]:
    | {
        decimals: number;
        name: string;
        symbol: string;
      }
    | undefined;
}

export type InputType = 'default' | 'enum' | 'array' | 'tuple' | 'tuple[]';
export type OutputType = 'default' | 'enum' | 'timestamp' | 'decimals' | 'contract' | 'array' | 'tuple' | 'tuple[]';

export type MatchingType = InternalType | 'url';
