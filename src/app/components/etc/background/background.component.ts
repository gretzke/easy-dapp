import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ColorSchemeService } from 'src/app/services/color-scheme.service';
import { setDarkMode } from 'src/app/store/app.actions';
import { darkModeSelector } from 'src/app/store/app.selector';
import { ThemeMode } from 'src/app/types';
import { loadFull } from 'tsparticles';
import { Container, Engine } from 'tsparticles-engine';
import { particlesOptions } from './particles.config';

@Component({
  selector: 'app-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.scss'],
})
export class BackgroundComponent implements OnInit {
  id = 'tsparticles';
  particlesOptions = particlesOptions;

  constructor(private colorSchemeService: ColorSchemeService) {}

  ngOnInit(): void {}

  async particlesInit(engine: Engine): Promise<void> {
    console.log(engine);
    // Starting from 1.19.0 you can add custom presets or shape here, using the current tsParticles instance (main)
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size

    await loadFull(engine);
  }

  particlesLoaded(container: Container): void {
    this.colorSchemeService.setContainer(container);
  }
}
