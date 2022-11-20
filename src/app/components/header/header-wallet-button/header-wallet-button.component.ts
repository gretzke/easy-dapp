import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { EthereumService } from 'src/app/services/ethereum.service';
import { userSelector } from 'src/app/store/app.selector';
import { IUser } from 'src/types';

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
  showModal = false;
  showDropdown = false;
  user$: Observable<IUser | undefined>;

  constructor(private ethereum: EthereumService, private store: Store<{}>) {
    this.user$ = this.store.select(userSelector);
  }

  ngOnInit(): void {}

  connect() {
    this.ethereum.connect('walletconnect');
  }
}
