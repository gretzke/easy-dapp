import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ethers } from 'ethers';
import { from, Observable } from 'rxjs';
import { chains } from 'src/helpers/chainConfig';
import { TokenType } from 'src/types/abi';
import { ERC1155__factory, ERC20__factory, ERC721__factory } from 'src/types/typechain';
import { watchPendingTransaction } from '../components/header/pending-tx/store/pendingtx.actions';
import { notify, requestChainIdChange, resetWallet, setChainId, walletChanged } from '../store/app.actions';
import { darkmodeSelector } from '../store/app.selector';
import { ContractBuilder } from './contract/ContractBuilder';
import { WalletProvider } from './wallets/wallet';
import { MetaMaskInpageProvider } from '@metamask/providers';

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

@Injectable({
  providedIn: 'root',
})
export class EthereumService {
  public signer: ethers.Signer | null = null;
  public provider: ethers.providers.JsonRpcProvider | null = null;
  public chainId: number = undefined!;
  public wallet!: WalletProvider;

  constructor(private store: Store<{}>) {}

  public async initWallet(wallet: WalletProvider) {
    this.wallet = wallet;
    this.store.select(darkmodeSelector).subscribe((theme) => {
      this.wallet.setTheme(theme ?? 'dark');
    });
    this.setupWatchers();
    await this.wallet.init();
    const account = this.wallet.getAccount();
    console.log('Startup', account);
    if (!account) {
      this.store.dispatch(requestChainIdChange({ src: EthereumService.name, chainId: 1 }));
    }
  }

  public async connect(): Promise<void> {
    await this.wallet.connect();
  }

  getChainId() {
    return this.chainId;
  }

  public async switchNetwork(chainId: number) {
    const account = this.wallet.getAccount();
    if (!account) {
      this.provider = this.wallet.fetchProvider(chainId);
      this.store.dispatch(setChainId({ src: EthereumService.name, chainId, oldChainId: this.chainId }));
      return;
    }
    try {
      await this.wallet.switchNetwork(chainId);
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
        this.store.dispatch(notify({ src: EthereumService.name, message: 'Failed to switch chain', notificationType: 'error' }));
        throw e;
      }
    }
  }

  private setupWatchers() {
    this.wallet.watchNetwork(async (chainId) => {
      console.log('network', chainId);
      if (chainId) {
        this.signer = (await this.wallet.fetchSigner()) as ethers.Signer;
        this.store.dispatch(setChainId({ src: EthereumService.name, chainId, oldChainId: this.chainId }));
        this.chainId = chainId;
      }
    });
    this.wallet.watchAccount(async (address) => {
      console.log('address connected', address);
      if (address) {
        this.signer = (await this.wallet.fetchSigner()) as ethers.Signer;
        this.store.dispatch(walletChanged({ src: EthereumService.name, address }));
      } else {
        this.signer = null;
        if (this.chainId) {
          this.provider = this.wallet.fetchProvider(this.chainId);
        }
        this.store.dispatch(resetWallet({ src: EthereumService.name }));
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
    return (this.signer?.provider ?? this.provider)?.getTransactionReceipt(txHash);
  }
}
