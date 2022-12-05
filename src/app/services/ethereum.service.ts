import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { configureChains, createClient, fetchSigner, getAccount, watchAccount, watchNetwork } from '@wagmi/core';
import { ClientCtrl, ConfigCtrl, ConfigOptions, ModalCtrl } from '@web3modal/core';
import { EthereumClient, modalConnectors, walletConnectProvider } from '@web3modal/ethereum';
import { ethers } from 'ethers';
import { EMPTY, from, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { chains } from 'src/helpers/chainConfig';
import { Web3Provider } from 'src/types';
import { getDapps, resetWallet, setChainId, userChanged } from '../store/app.actions';
import { chainSelector, darkmodeSelector } from '../store/app.selector';
import { ContractBuilder } from './contract/ContractBuilder';

// 1. Define constants
const projectId = environment.walletConnectId;
const { provider } = configureChains(chains, [walletConnectProvider({ projectId })]);
const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({ appName: 'EasyDapp', chains }),
  provider,
});
const ethereumClient = new EthereumClient(wagmiClient, chains);
ClientCtrl.setEthereumClient(ethereumClient);
const modalConfig: ConfigOptions = {
  projectId,
  accentColor: 'blackWhite',
};
ConfigCtrl.setConfig({ ...modalConfig, theme: 'dark' });

@Injectable({
  providedIn: 'root',
})
export class EthereumService {
  public signer: ethers.Signer | null = null;
  public chainId = 1;

  constructor(private store: Store<{}>) {
    this.store.select(darkmodeSelector).subscribe((theme) => {
      ConfigCtrl.setConfig({ ...modalConfig, theme });
    });
    this.store.select(chainSelector).subscribe(async (chain) => {
      if (chain.wallet) {
        this.signer = (await fetchSigner()) as ethers.Signer;
      }
    });

    this.loadUi();
    this.setupWatchers();
  }

  public connect(): void {
    ModalCtrl.open();
  }

  public accountConnected(): boolean {
    return getAccount().isConnected;
  }

  async loadUi() {
    await import('@web3modal/ui');
  }

  private setupWatchers() {
    watchAccount((data) => {
      console.log('address connected', data.address);
      if (data.address) {
        this.store.dispatch(userChanged({ src: EthereumService.name, address: data.address }));
      } else {
        this.store.dispatch(resetWallet({ src: EthereumService.name }));
        this.store.dispatch(getDapps({ src: EthereumService.name }));
      }
    });
    watchNetwork((data) => {
      if (data.chain) {
        console.log('network', data.chain.id);
        this.chainId = data.chain.id;
        this.store.dispatch(setChainId({ src: EthereumService.name, chainId: data.chain.id }));
        this.store.dispatch(getDapps({ src: EthereumService.name }));
      }
    });
  }

  public isAddress(address: string) {
    return ethers.utils.isAddress(address);
  }

  public signMessage(message: string): Observable<string> {
    return from(this.signer!.signMessage(message));
  }

  public getContractInstance(address: string, abi: string): ContractBuilder {
    return new ContractBuilder(this, this.chainId, address, abi);
  }
}
