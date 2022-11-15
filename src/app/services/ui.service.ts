import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Container } from 'tsparticles-engine';
import { ThemeMode } from '../../types';

@Injectable({
  providedIn: 'root',
})
export class UIService {
  private renderer: Renderer2;
  private colorScheme!: ThemeMode;
  container?: Container;

  constructor(rendererFactory: RendererFactory2) {
    // Create new renderer from renderFactory, to make it possible to use renderer2 in a service
    this.renderer = rendererFactory.createRenderer(null, null);
    this._init();
  }

  private _init() {
    this._getColorScheme();
    this.renderer.addClass(document.body, this.colorScheme);
  }

  public updateTheme(scheme: ThemeMode) {
    this._setColorScheme(scheme);
    this.renderer.removeClass(document.body, this.colorScheme === 'dark' ? 'light' : 'dark');
    this.renderer.addClass(document.body, scheme);
  }

  public currentActiveTheme(): ThemeMode {
    return this.colorScheme;
  }

  public setBackgroundContainer(container: Container) {
    this.container = container;
    this.container.loadTheme(this.colorScheme);
  }

  private _getColorScheme() {
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

  private _detectPrefersColorScheme() {
    // Detect if prefers-color-scheme is supported
    if (window.matchMedia('(prefers-color-scheme)').media !== 'not all') {
      // Set colorScheme to Dark if prefers-color-scheme is dark. Otherwise, set it to Light.
      this.colorScheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
      // If the browser does not support prefers-color-scheme, set the default to dark.
      this.colorScheme = 'dark';
    }
  }

  private _setColorScheme(scheme: ThemeMode) {
    this.colorScheme = scheme;
    // Save prefers-color-scheme to localStorage
    localStorage.setItem('prefers-color', scheme);
    if (this.container) {
      this.container.loadTheme(scheme);
    }
  }
}
