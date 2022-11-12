import { Component, OnInit } from '@angular/core';
import { ColorSchemeService } from 'src/app/services/color-scheme.service';
import { ThemeMode } from 'src/app/types';

@Component({
  selector: '[app-darkmode-toggle]',
  templateUrl: './darkmode-toggle.component.html',
  styleUrls: ['./darkmode-toggle.component.scss'],
})
export class DarkmodeToggleComponent implements OnInit {
  darkmode!: ThemeMode;

  constructor(private colorSchemeService: ColorSchemeService) {
    this.colorSchemeService.load();
    this.darkmode = this.colorSchemeService.currentActive();
  }

  ngOnInit(): void {}

  toggleDarkMode() {
    this.darkmode = this.darkmode === 'dark' ? 'light' : 'dark';
    this.colorSchemeService.update(this.darkmode);
  }
}
