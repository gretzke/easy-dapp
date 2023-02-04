import type { ChainWithDecimalId } from '@web3-onboard/common';
import Onboard, { WalletState } from '@web3-onboard/core';
import injectedModule from '@web3-onboard/injected-wallets';
import { ethers } from 'ethers';
import { chainArray, rpcUrls } from 'src/helpers/chainConfig';
import { WalletProvider } from './wallet';

const blockNativeChains = chainArray.map((chain) => {
  return {
    id: chain.id,
    token: chain.nativeCurrency.symbol,
    label: chain.name,
    rpcUrl: chain.rpcUrls.public.http[0],
    blockExplorerUrl: chain.blockExplorers?.default.url ?? 'empty',
    publicRpcUrl: rpcUrls[chain.id],
  } as ChainWithDecimalId;
});

const STORAGE_ID = 'blocknative_wallets';

export class BlockNative implements WalletProvider {
  private onboard;
  private wallets: WalletState[] = [];
  private accountCallback?: (account?: string) => void = () => {};
  private networkCallback?: (chainId?: number) => void = () => {};

  public async init() {
    // rehydrate previously connected wallets
    const previouslyConnectedWallets = JSON.parse(window.localStorage.getItem(STORAGE_ID) ?? '[]');

    if (previouslyConnectedWallets.length > 0) {
      this.wallets = await this.onboard.connectWallet({
        autoSelect: {
          label: previouslyConnectedWallets[0],
          disableModals: true,
        },
      });
    }
  }

  public constructor() {
    const injected = injectedModule({});

    this.onboard = Onboard({
      wallets: [injected],
      chains: blockNativeChains,
      appMetadata: {
        name: 'EasyDapp',
        description: 'UI tool for easy dapp development',
        icon: 'https://easyd.app/assets/img/logo_dark.png',
      },
      // TODO: position and make available optional via settings
      accountCenter: {
        desktop: {
          enabled: false,
          position: 'topLeft',
        },
        mobile: {
          enabled: false,
          position: 'bottomLeft',
        },
      },
    });
  }

  setTheme(theme: 'dark' | 'light'): void {
    this.onboard.state.actions.updateTheme(theme);
  }

  getAccount(): string | undefined {
    const [primaryWallet] = this.onboard.state.get().wallets;
    if (!primaryWallet || primaryWallet.accounts.length === 0) return;
    return primaryWallet.accounts[0].address;
  }

  async connect(): Promise<void> {
    await this.onboard.connectWallet();
  }

  async disconnect(): Promise<void> {
    if (!this.wallets[0]) return;
    await this.onboard.disconnectWallet({
      label: this.wallets[0]?.label,
    });
  }

  watchAccount(callback: (account?: string) => void): void {
    this.accountCallback = callback;
    const { unsubscribe } = this.onboard.state.select('wallets').subscribe((wallets) => {
      this.wallets = wallets;
      const connectedWallets = wallets.map(({ label }) => label);
      window.localStorage.setItem(STORAGE_ID, JSON.stringify(connectedWallets));
      if (this.networkCallback) {
        const chainId = Number(this.wallets[0]?.chains[0].id);
        this.networkCallback(chainId);
      }
      if (this.accountCallback) {
        this.accountCallback(wallets[0]?.accounts[0]?.address);
      }
    });
  }

  watchNetwork(callback: (chainId?: number) => void): void {
    this.networkCallback = callback;
  }

  async fetchSigner(): Promise<ethers.Signer> {
    return new ethers.providers.Web3Provider(this.wallets[0]?.provider, 'any').getSigner();
  }

  fetchProvider(chainId: number): ethers.providers.JsonRpcProvider | null {
    const rpc = rpcUrls[chainId];
    if (!rpc) return null;
    return new ethers.providers.JsonRpcProvider(rpc, 'any');
  }

  async switchNetwork(chainId: number): Promise<void> {
    await this.onboard.setChain({ chainId: '0x' + chainId.toString(16) });
  }
}
