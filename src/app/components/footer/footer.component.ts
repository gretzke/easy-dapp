import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { darkmodeSelector } from 'src/app/store/app.selector';
import { faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  public darkmode$ = this.store.select(darkmodeSelector);
  faGithub = faGithub;
  faTwitter = faTwitter;

  constructor(private store: Store<{}>) {}

  ngOnInit(): void {}
}
