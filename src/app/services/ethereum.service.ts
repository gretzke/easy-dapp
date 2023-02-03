import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { configureChains, createClient, fetchSigner, getAccount, switchNetwork, watchAccount, watchNetwork } from '@wagmi/core';
// import { ClientCtrl, ConfigCtrl, ModalCtrl } from '@web3modal/core';
import { EthereumClient, modalConnectors, walletConnectProvider } from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/html';
import { ethers } from 'ethers';
import { from, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { chainArray, chains } from 'src/helpers/chainConfig';
import { TokenType } from 'src/types/abi';
import { ERC1155__factory, ERC20__factory, ERC721__factory } from 'src/types/typechain';
import { watchPendingTransaction } from '../components/header/pending-tx/store/pendingtx.actions';
import { notify, resetWallet, setChainId, walletChanged } from '../store/app.actions';
import { darkmodeSelector } from '../store/app.selector';
import { ContractBuilder } from './contract/ContractBuilder';

// 1. Define constants
const projectId = environment.walletConnectId;
const { provider } = configureChains(chainArray, [walletConnectProvider({ projectId })]);
const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({ appName: 'EasyDapp', chains: chainArray }),
  provider,
});
const ethereumClient = new EthereumClient(wagmiClient, chainArray);

const web3modal = new Web3Modal({ projectId }, ethereumClient);

@Injectable({
  providedIn: 'root',
})
export class EthereumService {
  public signer: ethers.Signer | null = null;
  public chainId: number = undefined!;

  constructor(private store: Store<{}>) {
    this.store.select(darkmodeSelector).subscribe((theme) => {
      web3modal.setTheme({
        themeMode: theme,
        themeColor: 'blackWhite',
      });
    });
    this.setupWatchers();
  }

  public async connect(chainId?: number): Promise<void> {
    const selectedChain = chains[chainId ?? 0];
    let route: 'SelectNetwork' | 'ConnectWallet' = 'SelectNetwork';
    if (selectedChain) {
      web3modal.setSelectedChain(selectedChain);
      route = 'ConnectWallet';
    }
    web3modal.openModal({
      route,
    });
  }

  getChainId() {
    return this.chainId;
  }

  public async switchNetwork(chainId: number) {
    const account = getAccount();
    if (!account.isConnected) {
      this.connect();
      return;
    }
    try {
      await switchNetwork({ chainId });
    } catch (e) {
      // could not switch network, try adding it first
      if (typeof window.ethereum === 'undefined') {
        this.store.dispatch(
          notify({ src: EthereumService.name, message: 'Please use a wallet that allows adding networks.', notificationType: 'error' })
        );
        throw new Error('Please use a wallet that allows adding networks.');
      }
      const chain = chains[chainId];
      if (!chain) {
        this.store.dispatch(notify({ src: EthereumService.name, message: 'Chain config not found', notificationType: 'error' }));
        throw new Error('Chain config not found');
      }
      const url = chain.rpcUrls.public?.http[0] ?? chain.rpcUrls.default.http[0];
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: `0x${chainId.toString(16)}`,
              rpcUrls: [url],
              chainName: chain.name,
              nativeCurrency: chain.nativeCurrency,
              blockExplorerUrls: [chain.blockExplorers?.default.url ?? ''],
            },
          ],
        });
      } catch (e) {
        this.store.dispatch(notify({ src: EthereumService.name, message: 'Failed to add chain', notificationType: 'error' }));
        throw e;
      }
    }
  }

  private setupWatchers() {
    const account = getAccount();
    console.log('Startup', account);
    if (!account.isConnected) {
      this.store.dispatch(setChainId({ src: EthereumService.name, chainId: 1 }));
    }
    watchAccount(async (data) => {
      console.log('address connected', data.address);
      if (data.address) {
        // important dispatch before changing signer so effect run properly
        this.store.dispatch(walletChanged({ src: EthereumService.name, address: data.address }));
        this.signer = (await fetchSigner()) as ethers.Signer;
      } else {
        this.store.dispatch(resetWallet({ src: EthereumService.name }));
      }
    });
    watchNetwork(async (data) => {
      if (data.chain) {
        console.log('network', data.chain.id);
        // important dispatch before changing signer so setChainId effect runs properly
        this.store.dispatch(setChainId({ src: EthereumService.name, chainId: data.chain.id }));
        this.signer = (await fetchSigner()) as ethers.Signer;
        this.chainId = data.chain.id;
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

  public async approve(address: string, type: TokenType): Promise<void> {
    const user = await this.signer!.getAddress();
    if (type === 'ERC20') {
      const contract = ERC20__factory.connect(address, this.signer!);
      try {
        const allowance = await contract.allowance(user, address);
        if (allowance.gt(0)) return;
      } catch (e) {
        this.store.dispatch(notify({ src: EthereumService.name, message: 'Approval failed', notificationType: 'error' }));
        throw new Error('Approval error, the address or token type was probably misconfigured');
      }
      const tx = await contract.approve(address, ethers.constants.MaxUint256);
      this.store.dispatch(
        watchPendingTransaction({ src: EthereumService.name, name: 'Approve ERC20', txHash: tx.hash, chainId: this.chainId })
      );
      await tx.wait(1);
    } else if (type === 'ERC721') {
      const contract = ERC721__factory.connect(address, this.signer!);
      try {
        const approved = await contract.isApprovedForAll(user, address);
        if (approved) return;
      } catch (e) {
        this.store.dispatch(notify({ src: EthereumService.name, message: 'Approval failed', notificationType: 'error' }));
        throw new Error('Approval error, the address or token type was probably misconfigured');
      }
      const tx = await contract.setApprovalForAll(address, true);
      this.store.dispatch(
        watchPendingTransaction({ src: EthereumService.name, name: 'Approve ERC721', txHash: tx.hash, chainId: this.chainId })
      );
      await tx.wait(1);
    } else if (type === 'ERC1155') {
      const contract = ERC1155__factory.connect(address, this.signer!);
      try {
        const approved = await contract.isApprovedForAll(user, address);
        if (approved) return;
      } catch (e) {
        this.store.dispatch(notify({ src: EthereumService.name, message: 'Approval failed', notificationType: 'error' }));
        throw new Error('Approval error, the address or token type was probably misconfigured');
      }
      const tx = await contract.setApprovalForAll(address, true);
      this.store.dispatch(
        watchPendingTransaction({ src: EthereumService.name, name: 'Approve ERC1155', txHash: tx.hash, chainId: this.chainId })
      );
      await tx.wait(1);
    }
  }

  public transactionReceipt(txHash: string): Promise<ethers.providers.TransactionReceipt> | undefined {
    return this.signer?.provider?.getTransactionReceipt(txHash);
  }
}
