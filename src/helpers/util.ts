import { ethers } from 'ethers';

export const dappId = (owner: string, url: string) => {
  return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(owner + url));
};

export const getFunctionName = (signature: string) => {
  return signature.match(/(\w+)\(/)![1];
};
