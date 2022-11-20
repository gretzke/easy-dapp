import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { UIService } from 'src/app/services/ui.service';
import { setDarkmode } from 'src/app/store/app.actions';
import { darkmodeSelector } from 'src/app/store/app.selector';
import { ThemeMode } from 'src/types';

@Component({
  selector: '[app-darkmode-toggle]',
  templateUrl: './darkmode-toggle.component.html',
  styleUrls: ['./darkmode-toggle.component.scss'],
})
export class DarkmodeToggleComponent implements OnInit {
  darkmode: ThemeMode = 'dark';

  constructor(private store: Store<{}>) {}

  ngOnInit(): void {
    this.store.select(darkmodeSelector).subscribe((theme) => {
      if (theme) this.darkmode = theme;
    });
  }

  toggleDarkMode() {
    this.store.dispatch(setDarkmode({ src: DarkmodeToggleComponent.name, theme: this.darkmode === 'dark' ? 'light' : 'dark' }));
  }
}
