import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { EthereumService } from 'src/app/services/ethereum.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { dappsSelector } from 'src/app/store/app.selector';
import { IDapp } from 'src/types/abi';
import { IDapps } from 'src/types/api';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  faArrowRight = faArrowRight;
  public dapps: IDapps = [];
  private subscription: Subscription;

  constructor(private store: Store<{}>, private ethereum: EthereumService, private router: Router, private firebase: FirebaseService) {
    this.subscription = this.store.select(dappsSelector).subscribe((dapps) => {
      this.dapps = dapps;
    });
  }

  ngOnInit(): void {}

  async navigate(dapp: IDapp) {
    this.router.navigate(['/app', dapp.owner, dapp.url], {});
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
