// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { IEnvironment } from 'src/types/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

export const environment: IEnvironment = {
  production: false,
  walletConnectId: '8e6b5ffdcbc9794bf9f4a1952578365b',
  firebaseUrl: 'http://localhost:5001/easydapp-56895/europe-west1/',
  modules: [
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
    }),
  ],
  walletType: 'blocknative',
  googleAnalytics: 'G-5FL4G5MEZ1',
};
