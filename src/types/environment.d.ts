export type WalletType = 'web3modal' | 'blocknative';

export interface IEnvironment {
  production: boolean;
  walletConnectId: string;
  firebaseUrl: string;
  modules: any[];
  walletType: WalletType;
}
