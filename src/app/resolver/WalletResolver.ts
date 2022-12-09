import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { concatMap, filter, map, mergeMap, Observable, of, tap } from 'rxjs';
import { connectWallet, setWallet } from '../store/app.actions';
import { walletSelector } from '../store/app.selector';

@Injectable()
export class WalletResolver implements Resolve<boolean> {
  constructor(private store: Store<{}>, private actions$: Actions) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.store.select(walletSelector).pipe(
      filter((wallet) => wallet !== undefined),
      mergeMap((wallet) => {
        if (wallet !== null) return of(true);
        this.store.dispatch(connectWallet({ src: WalletResolver.name }));
        return this.actions$.pipe(
          ofType(setWallet),
          map(() => true)
        );
      })
    );
  }
}
