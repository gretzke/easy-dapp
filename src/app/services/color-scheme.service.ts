import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Container } from 'tsparticles-engine';
import { ThemeMode } from '../types';

@Injectable({
  providedIn: 'root',
})
export class ColorSchemeService {
  private renderer: Renderer2;
  private colorScheme!: ThemeMode;
  container?: Container;

  constructor(rendererFactory: RendererFactory2) {
    // Create new renderer from renderFactory, to make it possible to use renderer2 in a service
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  _detectPrefersColorScheme() {
    // Detect if prefers-color-scheme is supported
    if (window.matchMedia('(prefers-color-scheme)').media !== 'not all') {
      // Set colorScheme to Dark if prefers-color-scheme is dark. Otherwise, set it to Light.
      this.colorScheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
      // If the browser does not support prefers-color-scheme, set the default to dark.
      this.colorScheme = 'dark';
    }
  }

  _setColorScheme(scheme: ThemeMode) {
    this.colorScheme = scheme;
    // Save prefers-color-scheme to localStorage
    localStorage.setItem('prefers-color', scheme);
    if (this.container) {
      this.container.loadTheme(scheme);
    }
  }

  _getColorScheme() {
    const localStorageColorScheme = localStorage.getItem('prefers-color') as ThemeMode;
    // Check if any prefers-color-scheme is stored in localStorage
    if (localStorageColorScheme) {
      // Save prefers-color-scheme from localStorage
      this.colorScheme = localStorageColorScheme;
    } else {
      // If no prefers-color-scheme is stored in localStorage, try to detect OS default prefers-color-scheme
      this._detectPrefersColorScheme();
    }
  }

  load() {
    this._getColorScheme();
    // document.body.classList.add(this.colorScheme);
    this.renderer.addClass(document.body, this.colorScheme);
  }

  update(scheme: ThemeMode) {
    console.log(scheme);
    this._setColorScheme(scheme);
    // Remove the old color-scheme class
    // this.document
    //   .getElementsByTagName('html')[0]
    //   .classList.remove((this.colorScheme === 'dark' ? 'light' : 'dark'));
    this.renderer.removeClass(document.body, this.colorScheme === 'dark' ? 'light' : 'dark');
    // Add the new / current color-scheme class
    // document.body.classList.add(scheme);
    this.renderer.addClass(document.body, scheme);
  }

  currentActive(): ThemeMode {
    return this.colorScheme;
  }

  setContainer(container: Container) {
    this.container = container;
    this.container.loadTheme(this.colorScheme);
  }
}
