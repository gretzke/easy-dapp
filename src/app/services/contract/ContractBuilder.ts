import { ContractTransaction, ethers } from 'ethers';
import { from, Observable } from 'rxjs';
import { ABI, AbiFunctions, ABIItem, ContractDataType, IContractState } from 'src/types/abi';
import { EthereumService } from '../ethereum.service';

export class ContractBuilder {
  public readFunctions: AbiFunctions;
  public writeFunctions: AbiFunctions;
  public abi: ContractABI;

  constructor(private ethereum: EthereumService, public chainId: number, public address: string, abi: string) {
    this.abi = new ContractABI(abi);
    this.readFunctions = this.abi.readFunctions();
    this.writeFunctions = this.abi.writeFunctions();
  }

  // ContractState
  public getContractState(): Observable<IContractState> {
    const functionsToCall = Object.keys(this.readFunctions)
      .filter((key) => this.readFunctions[key].inputs.length === 0)
      .map(async (key) => ({ key, value: await this.get(this.readFunctions[key].name, []) }));

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
  public functions: AbiFunctions = {};
  public abi: ABI;

  constructor(abi: string) {
    this.abi = JSON.parse(abi);
    for (const f of this.abi) {
      this.functions = {
        ...this.functions,
        [this.getSignature(f)]: f,
      };
    }
  }

  public readFunctions(): AbiFunctions {
    return Object.keys(this.functions).reduce((obj, key) => {
      if (
        (this.functions[key].stateMutability === 'view' || this.functions[key].stateMutability === 'pure') &&
        this.functions[key].type === 'function'
      ) {
        return {
          ...obj,
          [key]: this.functions[key],
        };
      }
      return obj;
    }, {});
  }

  public writeFunctions(): AbiFunctions {
    return Object.keys(this.functions).reduce((obj, key) => {
      if (
        (this.functions[key].stateMutability === 'nonpayable' || this.functions[key].stateMutability === 'payable') &&
        this.functions[key].type === 'function'
      ) {
        return {
          ...obj,
          [key]: this.functions[key],
        };
      }
      return obj;
    }, {});
  }

  private getSignature(f: ABIItem): string {
    return f.name + '(' + f.inputs.map((i) => i.type).join(',') + ')';
  }
}
