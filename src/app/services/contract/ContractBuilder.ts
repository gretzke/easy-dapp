import { ContractTransaction, ethers } from 'ethers';
import { from, Observable } from 'rxjs';
import { ABI, ABIItem, ContractDataType, IContractState } from 'src/types/abi';
import { EthereumService } from '../ethereum.service';

export class ContractBuilder {
  public readFunctions: ABI;
  public writeFunctions: ABI;
  public abi: ContractABI;

  constructor(private ethereum: EthereumService, public chainId: number, public address: string, abi: string) {
    this.abi = new ContractABI(abi);
    this.readFunctions = this.abi.readFunctions();
    this.writeFunctions = this.abi.writeFunctions();
  }

  // ContractState
  public getContractState(): Observable<IContractState> {
    const functionsToCall = this.readFunctions
      .filter((f) => f.inputs.length === 0)
      .map(async (f) => ({ key: f.name, value: await this.get(f.name, []) }));

    return from(Promise.all(functionsToCall).then((res) => res.reduce((obj, item) => ({ ...obj, [item.key]: item.value }), {})));
  }

  public get(functionName: string, args: any[]): Promise<ContractDataType> {
    return this.contract()[functionName](...args) as Promise<ContractDataType>;
  }

  public set(functionName: string, args: any[]): Observable<ContractTransaction> {
    return from(this.contract()[functionName](...args) as Promise<ContractTransaction>);
  }

  private contract(): ethers.Contract {
    if (this.ethereum.signer === null) throw new Error('Signer is not set');
    return new ethers.Contract(this.address, this.abi.abi, this.ethereum.signer);
  }
}

export class ContractABI {
  public abi: ABI;
  constructor(abi: string) {
    this.abi = JSON.parse(abi).map((f: ABIItem) => {
      const signature = f.name + '(' + f.inputs.map((i) => i.type).join(',') + ')';
      return { ...f, signature };
    });
  }

  public readFunctions(): ABI {
    return this.abi.filter((f) => (f.stateMutability === 'view' || f.stateMutability === 'pure') && f.type === 'function');
  }

  public writeFunctions(): ABI {
    return this.abi.filter((f) => (f.stateMutability === 'nonpayable' || f.stateMutability === 'payable') && f.type === 'function');
  }
}
