import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { chain, configureChains, createClient, getAccount, watchAccount, getProvider, watchNetwork } from '@wagmi/core';
import { ClientCtrl, ConfigCtrl, ModalCtrl } from '@web3modal/core';
import { EthereumClient, modalConnectors, walletConnectProvider } from '@web3modal/ethereum';
import { ethers } from 'ethers';
import { environment } from 'src/environments/environment';
import { ThemeMode, Web3Provider } from 'src/types';
import { resetUser, setChainId, userChanged } from '../store/app.actions';
import { darkmodeSelector } from '../store/app.selector';
import { UIService } from './ui.service';

declare var window: any;

// 1. Define constants
const projectId = environment.walletConnectId;
const chains = [chain.goerli, chain.sepolia, chain.mainnet, chain.polygon];

@Injectable({
  providedIn: 'root',
})
export class EthereumService {
  private provider: ethers.providers.Web3Provider | null = null;
  private theme: ThemeMode = 'dark';

  constructor(private store: Store<{}>) {
    this.store.select(darkmodeSelector).subscribe((theme) => {
      if (theme) this.theme = theme;
    });
    const { provider } = configureChains(chains, [walletConnectProvider({ projectId })]);
    const wagmiClient = createClient({
      autoConnect: true,
      connectors: modalConnectors({ appName: 'EasyDapp', chains }),
      provider,
    });
    const ethereumClient = new EthereumClient(wagmiClient, chains);
    ClientCtrl.setEthereumClient(ethereumClient);
    this.loadUi();

    this.setupWatchers();
  }

  public async connect(provider: Web3Provider) {
    provider === 'metamask' ? this.connectMetaMask() : this.connectWalletConnect();
  }

  async loadUi() {
    await import('@web3modal/ui');
  }

  private async connectMetaMask() {
    console.log('metamask');
    this.provider = new ethers.providers.Web3Provider(window.ethereum);
    await this.provider.send('eth_requestAccounts', []);
    console.log('address', await this.provider.getSigner().getAddress());
  }

  private connectWalletConnect() {
    ConfigCtrl.setConfig({
      projectId,
      theme: this.theme,
      accentColor: 'blackWhite',
    });

    ModalCtrl.open();
    ModalCtrl.subscribe(async (newState) => {
      console.log(newState);
      this.provider = getProvider() as ethers.providers.Web3Provider;
    });
  }

  private setupWatchers() {
    watchAccount((data) => {
      console.log('address connected', data.address);
      if (data.address) {
        this.store.dispatch(userChanged({ src: EthereumService.name, address: data.address }));
      } else {
        this.store.dispatch(resetUser({ src: EthereumService.name }));
      }
    });
    watchNetwork((data) => {
      if (data.chain) {
        console.log('network', data.chain.id);
        this.store.dispatch(setChainId({ src: EthereumService.name, chainId: data.chain.id }));
      }
    });
  }
}

// const address = await this.provider.getSigner().getAddress()
// return {
//   address,
//   img: blockies.create({ seed: address, size: 10, scale: 4 }).toDataURL(),
// };
