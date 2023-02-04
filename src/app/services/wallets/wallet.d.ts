import { Chain } from '@wagmi/core';
import { ethers } from 'ethers';

export interface WalletProvider {
  init(): Promise<void>;
  setTheme(theme: 'dark' | 'light'): void;
  getAccount(): string | undefined;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  watchAccount(callback: (account?: string) => void): void;
  watchNetwork(callback: (chainId?: number) => void): void;
  switchNetwork(chainId: number): Promise<void>;
  fetchSigner(): Promise<ethers.Signer>;
}
