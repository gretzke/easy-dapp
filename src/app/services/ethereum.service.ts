import { Injectable } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { configureChains, createClient, fetchSigner, getAccount, switchNetwork, watchAccount, watchNetwork } from '@wagmi/core';
import { ClientCtrl, ConfigCtrl, ConfigOptions, ModalCtrl } from '@web3modal/core';
import { EthereumClient, modalConnectors, walletConnectProvider } from '@web3modal/ethereum';
import { ethers } from 'ethers';
import { firstValueFrom, from, Observable, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { chains } from 'src/helpers/chainConfig';
import { getDapps, resetWallet, setChainId, userChanged } from '../store/app.actions';
import { darkmodeSelector } from '../store/app.selector';
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
  private uiLoaded = false;

  constructor(private store: Store<{}>, private actions$: Actions) {
    this.store.select(darkmodeSelector).subscribe((theme) => {
      ConfigCtrl.setConfig({ ...modalConfig, theme });
    });
  }

  public async ethereumFactory() {
    await this.loadUi();
    const account = getAccount();
    if (!account.isConnected) {
      this.store.dispatch(getDapps({ src: EthereumService.name }));
    }
    this.setupWatchers();
    const actionListener = this.actions$.pipe(ofType(getDapps), take(1));
    return firstValueFrom(actionListener);
  }

  public async connect(): Promise<void> {
    await this.loadUi();
    ModalCtrl.open();
  }

  public switchNetwork(chainId: number) {
    switchNetwork({ chainId });
  }

  async loadUi() {
    if (this.uiLoaded) return;
    await import('@web3modal/ui');
    this.uiLoaded = true;
  }

  private setupWatchers() {
    watchNetwork(async (data) => {
      if (data.chain) {
        console.log('network', data.chain.id);
        this.signer = (await fetchSigner()) as ethers.Signer;
        this.chainId = data.chain.id;
        this.store.dispatch(setChainId({ src: EthereumService.name, chainId: data.chain.id }));
        this.store.dispatch(getDapps({ src: EthereumService.name }));
      }
    });
    watchAccount(async (data) => {
      console.log('address connected', data.address);
      if (data.address) {
        this.signer = (await fetchSigner()) as ethers.Signer;
        this.store.dispatch(userChanged({ src: EthereumService.name, address: data.address }));
      } else {
        this.store.dispatch(resetWallet({ src: EthereumService.name }));
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
