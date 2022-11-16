import { Component, OnInit } from '@angular/core';
import { EthereumService } from 'src/app/services/ethereum.service';

@Component({
  selector: '[app-header-wallet-button]',
  templateUrl: './header-wallet-button.component.html',
  styleUrls: ['./header-wallet-button.component.scss'],
})
export class HeaderWalletButtonComponent implements OnInit {
  showModal = false;
  constructor(private ethereum: EthereumService) {}

  ngOnInit(): void {}

  // connect() {
  //   this.ethereum.connect();
  // }
}
