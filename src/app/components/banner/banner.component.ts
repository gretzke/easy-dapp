import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { devModeSelector, localModeSelector } from 'src/app/services/dapps/store/dapps.selector';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
})
export class BannerComponent implements OnInit {
  localMode$ = this.store.select(localModeSelector);
  devMode$ = this.store.select(devModeSelector);

  constructor(private store: Store<{}>) {}

  ngOnInit(): void {}
}
