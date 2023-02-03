import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { skip, Subscription } from 'rxjs';
import { getDapps } from 'src/app/store/app.actions';
import { DappList, DappListType, Pagination, PaginationType } from 'src/app/store/app.reducer';
import { chainIdSelector, dappsSelector } from 'src/app/store/app.selector';
import { faLeftLong, faRightLong } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-dapp-list',
  templateUrl: './dapp-list.component.html',
  styleUrls: ['./dapp-list.component.scss'],
})
export class DappListComponent implements OnInit, OnDestroy {
  @Input() public type: DappListType = 'popular';
  @Input() public address: string | undefined;
  @Input() public persist = false;
  @Input() public title = '';
  public dapps?: DappList;
  public faLeft = faLeftLong;
  public faRight = faRightLong;
  private pagination: Pagination = { type: 'first', next: '', prev: [] };
  private subscription = new Subscription();

  constructor(private store: Store<{}>) {}

  ngOnInit(): void {
    this.subscription.add(
      this.store.select(dappsSelector(this.type)).subscribe((dapps) => {
        if (dapps) {
          this.pagination = { ...dapps.pagination };
          this.dapps = { ...dapps };
        }
      })
    );
    this.subscription.add(
      this.store
        .select(chainIdSelector)
        .pipe(skip(1))
        .subscribe((chainId) => {
          if (chainId) {
            this.getDapps('first');
          }
        })
    );
    if (!this.persist || !this.dapps) {
      this.getDapps('first');
    }
  }

  private getDapps(paginationType: PaginationType) {
    const pagination = { ...this.pagination, type: paginationType };
    this.store.dispatch(
      getDapps({ src: DappListComponent.name, listType: this.type, pagination, persist: paginationType !== 'first', address: this.address })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public next() {
    this.getDapps('next');
  }

  public prev() {
    this.getDapps('prev');
  }
}
