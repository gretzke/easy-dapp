export interface IEnvironment {
  production: boolean;
  testnet: {
    moralis: {
      appId: string;
      serverUrl: string;
    };
  };
  mainnet: {
    moralis: {
      appId: string;
      serverUrl: string;
    };
  };
}
