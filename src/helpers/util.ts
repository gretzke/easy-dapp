import { BigNumber, ethers } from 'ethers';
import { ContractDataType, InputFormatterType, InputsConfig } from 'src/types/abi';
import { FirebaseDate } from 'src/types/api';
const { binary_to_base58 } = require('base58-js');

const currentTimestamp = (Date.now() / 1000).toFixed(0);
export const uintRegex = /^uint\d*$/;
export const intRegex = /^int\d*$/;
export const bytesRegex = /^bytes\d*$/;

export const dappId = (owner: string, url: string) => {
  const hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(owner + url));
  return binary_to_base58(ethers.utils.arrayify(hash));
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
  else if (type === 'address') {
    if (ethers.utils.isAddress(value)) return value;
    return undefined;
  } else if (uintRegex.test(type)) {
    if (!value) return undefined;
    else if (config && config.formatter === 'decimals') {
      return ethers.utils.parseUnits(value, config.decimals ?? 18);
    }
    return BigNumber.from(value);
  } else if (intRegex.test(type)) {
    if (!value || value == '-') return undefined;
    else if (config && config.formatter === 'decimals') {
      return ethers.utils.parseUnits(value, config.decimals ?? 18);
    }
    return BigNumber.from(value);
  } else if (type === 'bool') return value === 'true';
  else if (type === 'string') return value;
  else return value;
};

export const dateToMilliseconds = (date?: FirebaseDate): number => {
  if (date === undefined) return 0;
  return date._seconds * 1000 + date._nanoseconds / 1000000;
};

export const toSpaceCase = (str: string): string => {
  return (
    str
      // replace underscores and dashes with a space
      .replace(/[-_]/g, ' ')
      // insert a space between lower & upper: HttpRequest => Http Request
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      // space before last upper in a sequence followed by lower: XMLHttp => XML Http
      .replace(/\b([A-Z]+)([A-Z])([a-z])/, '$1 $2$3')
      // add space between numbers and letters: Col1 => Col 1
      .replace(/([a-zA-Z])([0-9])/g, '$1 $2')
      .replace(/([0-9])([a-zA-Z])/g, '$1 $2')
      // uppercase the first character
      .replace(/^./, (firstChar) => firstChar.toUpperCase())
      // replace multiple whitespaces with one
      .replace(/\s+/g, ' ')
      .trim()
  );
};
