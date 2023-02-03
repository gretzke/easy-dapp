import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { connectWallet, login, logout } from 'src/app/store/app.actions';
import { userSelector, walletSelector } from 'src/app/store/app.selector';
import { IUser, IWallet } from 'src/types';
import { faUser, faRightToBracket, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: '[app-header-wallet-button]',
  templateUrl: './header-wallet-button.component.html',
  styleUrls: ['./header-wallet-button.component.scss'],
  animations: [
    trigger('opacityScale', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(.95)' }),
        animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'scale(1)' }),
        animate('75ms ease-in', style({ opacity: 0, transform: 'scale(.95)' })),
      ]),
    ]),
  ],
})
export class HeaderWalletButtonComponent implements OnInit {
  showDropdown = false;
  wallet$: Observable<IWallet | null>;
  user$: Observable<IUser | null>;
  faUser = faUser;
  faLogin = faRightToBracket;
  faLogout = faRightFromBracket;

  constructor(private store: Store<{}>) {
    this.wallet$ = this.store.select(walletSelector);
    this.user$ = this.store.select(userSelector);
  }

  ngOnInit(): void {}

  connect() {
    this.store.dispatch(connectWallet({ src: HeaderWalletButtonComponent.name }));
  }

  login() {
    this.store.dispatch(login({ src: HeaderWalletButtonComponent.name }));
  }

  logout() {
    this.store.dispatch(logout({ src: HeaderWalletButtonComponent.name }));
  }

  trim(wallet: string) {
    return wallet.slice(2, 8).toUpperCase();
  }
}
