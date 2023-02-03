import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ethers } from 'ethers';
import { notify } from 'src/app/store/app.actions';
import { UIService } from 'src/app/services/ui.service';
import { SafeResourceUrl } from '@angular/platform-browser';
import { faHeart, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import { localModeSelector } from 'src/app/services/dapps/store/dapps.selector';
import { Subscription } from 'rxjs';

type Tab = 'dapps' | 'likes';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  public address?: string;
  public image?: SafeResourceUrl;
  public tab: Tab = 'dapps';
  public localMode$ = this.store.select(localModeSelector);
  faHeart = faHeart;
  faDapps = faLayerGroup;
  private subscriptions = new Subscription();

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private store: Store<{}>, private ui: UIService) {
    this.subscriptions.add(
      this.activatedRoute.params.subscribe((params) => {
        this.init(params.address);
      })
    );
  }

  private init(address: string) {
    this.address = undefined;
    setTimeout(() => {
      this.image = this.ui.getProfilePicture(address.toLowerCase());
      if (!ethers.utils.isAddress(address)) {
        this.store.dispatch(notify({ src: ProfileComponent.name, message: 'Invalid address', notificationType: 'error' }));
        this.router.navigate(['/']);
      }
      this.address = address;
    });
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
