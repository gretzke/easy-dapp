import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { filter, take, takeWhile } from 'rxjs';
import { EthereumService } from '../services/ethereum.service';
import { chainIdSelector, walletSelector } from '../store/app.selector';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  loading = true;
  constructor(private translate: TranslateService, private store: Store<{}>) {
    this.translate.setDefaultLang('en');
  }

  ngOnInit(): void {
    // wait for wallet to be initialized
    this.store
      .select(chainIdSelector)
      .pipe(
        filter((chainId) => chainId !== undefined),
        take(1)
      )
      .subscribe(() => {
        this.loading = false;
      });
  }
}
