import { IApiError } from 'src/types/api';

export const handleError = (errString: string): IApiError => {
  const e = JSON.parse(errString).error;
  const message = e.message;
  const details = e.details;
  return { message, details };
};

export const getErrorMessage = (errString: string): string => {
  const e = JSON.parse(errString).error;
  let message = e.message;
  let details = e.details;
  if (message === 'PARSE_ERROR') {
    if (details === 'INVALID_ADDRESS') {
      message = 'Invalid address';
    } else if (details === 'DAPP_EXISTS') {
      message = 'You already have a Dapp under this URL';
    }
  }
  return message;
};
