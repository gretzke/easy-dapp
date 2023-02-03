import { Component, OnInit } from '@angular/core';
import { UIService } from 'src/app/services/ui.service';
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

  constructor(private ui: UIService) {}

  ngOnInit(): void {}

  async particlesInit(engine: Engine): Promise<void> {
    // Starting from 1.19.0 you can add custom presets or shape here, using the current tsParticles instance (main)
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size

    await loadFull(engine);
  }

  particlesLoaded(container: Container): void {
    this.ui.setBackgroundContainer(container);
  }
}
