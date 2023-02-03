import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { localModeSelector } from 'src/app/services/dapps/store/dapps.selector';
import { chainIdSelector } from 'src/app/store/app.selector';
import { IDapp, IDappConfig } from 'src/types/abi';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  chainId$ = this.store.select(chainIdSelector);
  localMode$ = this.store.select(localModeSelector);
  exampleDapps: IDapp[] = [
    {
      address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      config: { name: 'WETH' } as IDappConfig,
      owner: '0xee8bcf545bf80682b78d99f65742d34166cb0405',
      url: 'weth',
    } as IDapp,
    {
      address: '0xba12222222228d8ba445958a75a0704d566bf2c8',
      config: { name: 'Balancer Vault' } as IDappConfig,
      owner: '0xee8bcf545bf80682b78d99f65742d34166cb0405',
      url: 'balancer-vault',
    } as IDapp,
  ];

  constructor(private store: Store<{}>) {}

  ngOnInit(): void {}
}
