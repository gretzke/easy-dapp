import { Component, OnInit } from '@angular/core';
import { UIService } from 'src/app/services/ui.service';
import { ThemeMode } from 'src/types';

@Component({
  selector: '[app-darkmode-toggle]',
  templateUrl: './darkmode-toggle.component.html',
  styleUrls: ['./darkmode-toggle.component.scss'],
})
export class DarkmodeToggleComponent implements OnInit {
  darkmode!: ThemeMode;

  constructor(private ui: UIService) {
    this.darkmode = this.ui.currentActiveTheme();
  }

  ngOnInit(): void {}

  toggleDarkMode() {
    this.darkmode = this.darkmode === 'dark' ? 'light' : 'dark';
    this.ui.updateTheme(this.darkmode);
  }
}
