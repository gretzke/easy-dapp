import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { walletSelector } from '../store/app.selector';

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
    this.store.select(walletSelector).subscribe((wallet) => {
      if (wallet !== undefined) {
        this.loading = false;
      }
    });
  }
}
