import { BigNumber, BigNumberish } from 'ethers';
import { ContractBuilder } from 'src/app/services/contract/ContractBuilder';

type StateMutabilityRead = 'view' | 'pure';
type StateMutabilityWrite = 'nonpayable' | 'payable';
type ItemType = 'function' | 'constructor' | 'fallback' | 'event' | 'error';
type InternalType = 'address' | 'uint256' | 'string';

interface VariableType {
  name: string;
  type: string;
  internalType: InternalType;
}

interface ABIItem {
  name: string;
  type: ItemType;
  stateMutability: StateMutabilityRead | StateMutabilityWrite;
  inputs: VariableType[];
  outputs: VariableType[];
}

export type ABI = ABIItem[];

export type ContractDataType = BigNumber | BigNumberish | string | boolean | number;

export interface IContractState {
  [x: string]: ContractDataType;
}

export interface IAbiData {
  id: string;
  abi: string;
}

export interface IDappConfig {
  name: string;
  description: string;
}

export interface IDapp {
  abi: string;
  address: string;
  chainId: number;
  config: IDappConfig;
  owner: string;
  url: string;
}
