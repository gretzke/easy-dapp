import { IEnvironment } from 'src/types/environment';
import { environment as environmentDev } from './environment';

export const environment: IEnvironment = {
  ...environmentDev,
  production: true,
};
