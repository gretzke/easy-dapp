import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Chain } from 'viem/chains';
import { EthereumService } from 'src/app/services/ethereum.service';
import { requestChainIdChange } from 'src/app/store/app.actions';
import { chainIdSelector } from 'src/app/store/app.selector';
import { chains, sortedChains } from 'src/helpers/chainConfig';

@Component({
  selector: 'app-network-selection',
  templateUrl: './network-selection.component.html',
  styleUrls: ['./network-selection.component.scss'],
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
export class NetworkSelectionComponent implements OnInit {
  public network?: Chain;
  public showModal = false;
  public sortedChains = sortedChains;

  constructor(private store: Store<{}>, private ethereum: EthereumService) {
    this.store.select(chainIdSelector).subscribe((chainId) => {
      this.network = chains[chainId];
    });
  }

  ngOnInit(): void {}

  selectNetwork(chainId: number): void {
    this.store.dispatch(requestChainIdChange({ src: NetworkSelectionComponent.name, chainId }));
    this.showModal = false;
  }

  unsorted(_: any): number {
    return 0;
  }
}
