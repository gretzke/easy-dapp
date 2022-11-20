import { EthereumService } from '../ethereum.service';
import { ethers, ContractInterface } from 'ethers';

export class ContractBuilder {
  constructor(private ethereum: EthereumService, public address: string, public abi: ContractInterface) {}

  public get(functionName: string, ...args: any[]): ethers.BigNumber {
    return this.contract()[functionName](...args);
  }

  public set(functionName: string, ...args: any[]) {
    return this.contract()[functionName](...args);
  }

  private contract(): ethers.Contract {
    if (this.ethereum.signer === null) throw new Error('Signer is not set');
    return new ethers.Contract(this.address, this.abi, this.ethereum.signer);
  }
}
