import { IApiError } from 'src/types/api';
import { getParsedEthersError, EthersError, ReturnValue } from '@enzoferey/ethers-error-parser';

export const handleError = (errString: string): IApiError => {
  const e = JSON.parse(errString).error;
  const message = e.message;
  const details = e.details;
  return { message, details };
};

const parseErrors: { [key: string]: string } = {
  INVALID_ADDRESS: 'Invalid address',
  DAPP_EXISTS: 'You already have a Dapp under this URL',
  NOT_OWNER: 'You are not the owner of this Dapp',
  DAPP_NOT_FOUND: 'Dapp not found',
  ABI_NOT_FOUND: 'ABI not found',
  DAPP_DOES_NOT_EXISTS: 'Dapp does not exist',
  INVALID_ID: 'Invalid ID',
  OWNER_NOT_FOUND: "You don't have an account",
  TOO_MANY_DAPPS: 'Accounts are currently limited to 500 Dapps per chain',
};

export const getErrorMessage = (errString: string): string => {
  const e = JSON.parse(errString).error;
  let message = e.message;
  let details = e.details;
  console.log(message, details);
  if (message === 'INTERNAL_ERROR') return 'Internal server error';
  if (message === 'PARSE_ERROR') {
    return parseErrors[details] ?? details;
  }
  return details;
};

export interface EthersErr {
  reverted: true;
  reason: EthersError;
}

export const parseEthersError = (error: EthersError): string => {
  const ethersError = getParsedEthersError(error);
  return ethersError.errorCode + (ethersError.context ? ': ' + ethersError.context : '');
};
