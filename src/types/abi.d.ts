import { BigNumber, BigNumberish } from 'ethers';

type StateMutabilityRead = 'view' | 'pure';
type StateMutabilityWrite = 'nonpayable' | 'payable';
type ItemType = 'function' | 'constructor' | 'fallback' | 'event' | 'error';

// prettier-ignore
type Uint = 'uint' | 'uint8' | 'uint16' | 'uint24' | 'uint32' | 'uint40' | 'uint48' | 'uint56' | 'uint64' | 'uint72' | 'uint80' | 'uint88' | 'uint96' | 'uint104' | 'uint112' | 'uint120' | 'uint128' | 'uint136' | 'uint144' | 'uint152' | 'uint160' | 'uint168' | 'uint176' | 'uint184' | 'uint192' | 'uint200' | 'uint208' | 'uint216' | 'uint224' | 'uint232' | 'uint240' | 'uint248' | 'uint256';
// prettier-ignore
type Int = 'int' | 'int8' | 'int16' | 'int24' | 'int32' | 'int40' | 'int48' | 'int56' | 'int64' | 'int72' | 'int80' | 'int88' | 'int96' | 'int104' | 'int112' | 'int120' | 'int128' | 'int136' | 'int144' | 'int152' | 'int160' | 'int168' | 'int176' | 'int184' | 'int192' | 'int200' | 'int208' | 'int216' | 'int224' | 'int232' | 'int240' | 'int248' | 'int256';
// prettier-ignore
type Bytes = 'bytes' | 'bytes1' | 'bytes2' | 'bytes3' | 'bytes4' | 'bytes5' | 'bytes6' | 'bytes7' | 'bytes8' | 'bytes9' | 'bytes10' | 'bytes11' | 'bytes12' | 'bytes13' | 'bytes14' | 'bytes15' | 'bytes16' | 'bytes17' | 'bytes18' | 'bytes19' | 'bytes20' | 'bytes21' | 'bytes22' | 'bytes23' | 'bytes24' | 'bytes25' | 'bytes26' | 'bytes27' | 'bytes28' | 'bytes29' | 'bytes30' | 'bytes31' | 'bytes32';
type InternalType = 'address' | 'string' | Uint | Int | 'bool';

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

export interface AbiFunctions {
  [signature: string]: ABIItem;
}

export type ValidDataType = BigNumber | BigNumberish | string | boolean | number;

export type ContractDataType = ValidDataType | ValidDataType[];

export interface IContractState {
  [signature: string]: ContractDataType;
}

export interface IAbiData {
  id: string;
  abi: string;
}

export type InputFormatterType = 'decimals' | 'timestamp';

export interface InputsConfig {
  name?: string;
  formatter?: InputFormatterType;
  decimals?: string;
}

export interface OutputsConfig {
  name: string;
}

export interface IBaseFieldConfig {
  name: string;
  description: string;
  hidden: boolean;
  inputs: InputsConfig[];
  outputs: OutputsConfig[];
}

export interface IReadFieldConfig extends IBaseFieldConfig {}

export type TokenType = 'ERC20' | 'ERC721' | 'ERC1155';

export interface ApprovalConfig {
  address: string;
  token: TokenType;
}

export interface IWriteFieldConfig extends IBaseFieldConfig {
  approvalHook?: ApprovalConfig;
}

export type FunctionType = 'read' | 'write';

export interface IDappConfig {
  name: string;
  description: string;
  functionConfig: {
    [signature: string]: IReadFieldConfig | IWriteFieldConfig;
  };
  read: {
    order: string[];
  };
  write: {
    order: string[];
  };
  enums?: {
    [name: string]: string[];
  };
}

export interface IFieldWithConfig {
  field: ABIItem;
  config?: IReadFieldConfig | IWriteFieldConfig;
}

export interface IDapp {
  abi: string;
  address: string;
  chainId: number;
  config: IDappConfig;
  owner: string;
  url: string;
}
