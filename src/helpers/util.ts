import { BigNumber, ethers } from 'ethers';
import { ContractDataType, InputFormatterType, InputsConfig } from 'src/types/abi';

const currentTimestamp = (Date.now() / 1000).toFixed(0);
export const uintRegex = /^uint\d*$/;
export const intRegex = /^int\d*$/;
export const bytesRegex = /^bytes\d*$/;

export const dappId = (owner: string, url: string) => {
  return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(owner + url));
};

export const getFunctionName = (signature: string) => {
  return signature.match(/(\w+)\(/)![1];
};

export const placeholder = (type?: string, format?: InputFormatterType): string => {
  if (!type) return '';
  if (type === 'address') return '0xA1337b...';
  if (uintRegex.test(type)) {
    if (!format) return '1337';
    if (format === 'timestamp') return currentTimestamp;
    if (format === 'decimals') return '12.34';
  }
  if (intRegex.test(type)) return '-1337';
  if (bytesRegex.test(type)) return '0x...';
  if (type === 'string') return 'Hello World';
  if (type === 'bool') return 'true';
  else return '';
};

export const transformValue = (type: string, value: string, config?: InputsConfig): ContractDataType | undefined => {
  if (!type) return '';
  if (type === 'address') return value;
  if (uintRegex.test(type)) {
    if (!value) return undefined;
    if (config && config.formatter === 'decimals') {
      return ethers.utils.parseUnits(value, config.decimals ?? 18);
    }
    return BigNumber.from(value);
  }
  if (intRegex.test(type)) {
    if (!value) return undefined;
    if (config && config.formatter === 'decimals') {
      return ethers.utils.parseUnits(value, config.decimals ?? 18);
    }
    return BigNumber.from(value);
  }
  if (type === 'bool') return value === 'true';
  if (type === 'string') return value;
  else return value;
};
