import { Component, OnInit } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs';
import { resetUser, setUser } from '../store/app.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  loading = true;
  constructor(private translate: TranslateService, private actions: Actions) {
    this.translate.setDefaultLang('en');
  }

  ngOnInit(): void {
    this.actions.pipe(ofType(setUser, resetUser), take(1)).subscribe(() => {
      console.log('test');
      this.loading = false;
    });
  }
}
