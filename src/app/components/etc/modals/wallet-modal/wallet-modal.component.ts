import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input } from '@angular/core';
import { EthereumService } from 'src/app/services/ethereum.service';
import { Web3Provider } from 'src/types';

@Component({
  selector: 'app-wallet-modal',
  templateUrl: './wallet-modal.component.html',
  styleUrls: ['./wallet-modal.component.scss'],
  animations: [
    trigger('opacity', [
      transition(':enter', [style({ opacity: 0 }), animate('300ms ease-out', style({ opacity: 1 }))]),
      transition(':leave', [style({ opacity: 1 }), animate('200ms ease-in', style({ opacity: 0 }))]),
    ]),
    trigger('opacityTranslateY', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(1rem)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'translateY(0)' }),
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(1rem)' })),
      ]),
    ]),
  ],
})
export class WalletModalComponent {
  @Input() showModal = false;

  constructor(private ethereum: EthereumService) {}

  toggleModal() {
    this.showModal = !this.showModal;
  }

  connect(_: Web3Provider) {
    this.ethereum.connect();
    // this.toggleModal();
  }
}
