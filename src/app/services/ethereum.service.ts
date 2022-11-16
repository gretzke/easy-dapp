import { Injectable } from '@angular/core';
import { chain, configureChains, createClient, getAccount, watchAccount, getProvider } from '@wagmi/core';
import { ClientCtrl, ConfigCtrl, ModalCtrl } from '@web3modal/core';
import { EthereumClient, modalConnectors, walletConnectProvider } from '@web3modal/ethereum';
import { ethers } from 'ethers';
import { environment } from 'src/environments/environment';
import { Web3Provider } from 'src/types';
import { UIService } from './ui.service';

declare var window: any;

// 1. Define constants
const projectId = environment.walletConnectId;
const chains = [chain.mainnet, chain.polygon];

@Injectable({
  providedIn: 'root',
})
export class EthereumService {
  private provider: ethers.providers.Web3Provider | null = null;

  constructor(private ui: UIService) {
    const { provider } = configureChains(chains, [walletConnectProvider({ projectId })]);
    const wagmiClient = createClient({
      autoConnect: true,
      connectors: modalConnectors({ appName: 'EasyDapp', chains }),
      provider,
    });
    const ethereumClient = new EthereumClient(wagmiClient, chains);
    ClientCtrl.setEthereumClient(ethereumClient);
    this.loadUi();
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
      theme: this.ui.currentActiveTheme(),
      accentColor: 'blackWhite',
    });

    ModalCtrl.open();
    ModalCtrl.subscribe(async (newState) => {
      console.log(newState);
      this.provider = getProvider() as ethers.providers.Web3Provider;
    });

    const account = getAccount();
    console.log(account);

    console.log(getProvider());
    watchAccount((data) => {
      console.log('data', data);
    });
  }
}

// const address = await this.provider.getSigner().getAddress()
// return {
//   address,
//   img: blockies.create({ seed: address, size: 10, scale: 4 }).toDataURL(),
// };
