import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { walletSelector } from 'src/app/store/app.selector';
import { IWallet } from 'src/types';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  showMenu = false;
  private wallet: IWallet | null = null;
  private _links = [
    { name: 'Dashboard', requireWallet: false, path: '/' },
    { name: 'New Dapp', requireWallet: true, path: '/new-dapp' },
  ];

  constructor(private store: Store<{}>) {
    this.store.select(walletSelector).subscribe((wallet) => {
      this.wallet = wallet;
    });
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  get links() {
    return this._links.filter((link) => {
      if (link.requireWallet) {
        return this.wallet !== null;
      }
      return true;
    });
  }
}
