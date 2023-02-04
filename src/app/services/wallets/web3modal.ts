import {
  Chain,
  configureChains,
  createClient,
  fetchSigner,
  getAccount,
  GetAccountResult,
  GetNetworkResult,
  Provider,
  switchNetwork,
  watchAccount,
  watchNetwork,
} from '@wagmi/core';
import { EthereumClient, modalConnectors, walletConnectProvider } from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/html';
import { ethers } from 'ethers';
import { environment } from 'src/environments/environment';
import { chainArray, chains } from 'src/helpers/chainConfig';
import { WalletProvider } from './wallet';

export class WalletConnect implements WalletProvider {
  modal: Web3Modal;

  public async init() {}

  public constructor() {
    const projectId = environment.walletConnectId;
    const { provider } = configureChains(chainArray, [walletConnectProvider({ projectId })]);
    const wagmiClient = createClient({
      autoConnect: true,
      connectors: modalConnectors({ appName: 'EasyDapp', chains: chainArray }),
      provider,
    });
    const ethereumClient = new EthereumClient(wagmiClient, chainArray);
    this.modal = new Web3Modal({ projectId }, ethereumClient) as Web3Modal;
  }

  setTheme(theme: 'dark' | 'light'): void {
    this.modal.setTheme({
      themeMode: theme,
      themeColor: 'blackWhite',
    });
  }

  getAccount(): string | undefined {
    const account = getAccount();
    if (account.isConnected) return account.address;
    return;
  }

  async connect(): Promise<void> {
    this.modal.openModal({ route: 'ConnectWallet' });
  }

  async disconnect(): Promise<void> {}

  openModal(options: { route: 'SelectNetwork' | 'ConnectWallet' }): void {
    this.modal.openModal(options);
  }

  async switchNetwork(chainId: number): Promise<void> {
    await switchNetwork({ chainId });
  }

  watchAccount(callback: (account?: string) => void): void {
    watchAccount((data: GetAccountResult<Provider>) => {
      callback(data.address);
    });
  }

  watchNetwork(callback: (chainId?: number) => void): void {
    watchNetwork((data: GetNetworkResult) => {
      callback(data.chain?.id);
    });
  }

  async fetchSigner(): Promise<ethers.Signer> {
    return (await fetchSigner()) as ethers.Signer;
  }

  setSelectedChain(chain: Chain): void {
    this.modal.setSelectedChain(chain);
  }

  fetchProvider(chainId: number): ethers.providers.JsonRpcProvider | null {
    const rpc = chains[chainId].blockExplorers?.default.url;
    if (!rpc) return null;
    return new ethers.providers.JsonRpcProvider(rpc, 'any');
  }
}
