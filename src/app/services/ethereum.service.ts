import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { chain, configureChains, createClient, watchAccount, getProvider, watchNetwork, getContract, fetchSigner } from '@wagmi/core';
import { ClientCtrl, ConfigCtrl, ModalCtrl } from '@web3modal/core';
import { EthereumClient, modalConnectors, walletConnectProvider } from '@web3modal/ethereum';
import { ethers } from 'ethers';
import { environment } from 'src/environments/environment';
import { ThemeMode, Web3Provider } from 'src/types';
import { resetUser, setChainId, userChanged } from '../store/app.actions';
import { chainSelector, darkmodeSelector, userSelector } from '../store/app.selector';
import { ContractBuilder } from './contract/ContractBuilder';

declare var window: any;

// 1. Define constants
const projectId = environment.walletConnectId;
const chains = [chain.goerli, chain.sepolia, chain.mainnet, chain.polygon];

@Injectable({
  providedIn: 'root',
})
export class EthereumService {
  public signer: ethers.Signer | null = null;
  private theme: ThemeMode = 'dark';
  public contract: ContractBuilder | null = null;

  constructor(private store: Store<{}>) {
    this.store.select(darkmodeSelector).subscribe((theme) => {
      if (theme) this.theme = theme;
    });
    this.store.select(chainSelector).subscribe(async (chain) => {
      if (chain.user) {
        this.signer = (await fetchSigner()) as ethers.Signer;
        this.contract = new ContractBuilder(this, '0xf689544b2fe7f026A3a263F4CF54E28bFE3944F5', [
          {
            inputs: [],
            name: 'num',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [{ internalType: 'uint256', name: 'newNum', type: 'uint256' }],
            name: 'setNum',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
        ]);
      }
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
    // console.log('metamask');
    // this.provider = new ethers.providers.Web3Provider(window.ethereum);
    // await this.provider.send('eth_requestAccounts', []);
    // console.log('address', await this.provider.getSigner().getAddress());
  }

  private connectWalletConnect() {
    ConfigCtrl.setConfig({
      projectId,
      theme: this.theme,
      accentColor: 'blackWhite',
    });

    ModalCtrl.open();
    // ModalCtrl.subscribe(async (newState) => {
    //   console.log(newState);
    //   this.provider = getProvider() as ethers.providers.Web3Provider;
    // });
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
