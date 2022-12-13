import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, OnInit, Renderer2, RendererFactory2 } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import blockies from 'blockies-ts';
import { Observable, of } from 'rxjs';
import { Container } from 'tsparticles-engine';
import { ThemeMode } from '../../types';
import { setDarkmode } from '../store/app.actions';
import { darkmodeSelector } from '../store/app.selector';

@Injectable({
  providedIn: 'root',
})
export class UIService implements OnInit {
  private renderer: Renderer2;
  theme: ThemeMode = 'dark';
  container?: Container;

  constructor(private store: Store<{}>, rendererFactory: RendererFactory2, @Inject(DOCUMENT) private document: Document) {
    // Create new renderer from renderFactory, to make it possible to use renderer2 in a service
    this.renderer = rendererFactory.createRenderer(null, null);
    this.store.select(darkmodeSelector).subscribe((theme) => {
      if (theme === undefined) {
        this._detectPrefersColorScheme();
      } else {
        this.updateTheme(theme);
      }
    });
  }

  ngOnInit() {}

  public updateTheme(scheme: ThemeMode) {
    this.theme = scheme;
    this.renderer.removeClass(document.body, scheme === 'dark' ? 'light' : 'dark');
    this.renderer.addClass(document.body, scheme);
    if (this.container) {
      this.container.loadTheme(scheme);
    }
    // set date picker theme
    const themelink = this.document.getElementById('app-theme');
    if (themelink) {
      if (this.theme === 'dark') {
        themelink.setAttribute('href', 'datepicker-dark.css');
      } else {
        themelink.setAttribute('href', 'datepicker-light.css');
      }
    }
  }

  public setBackgroundContainer(container: Container) {
    this.container = container;
    this.container.loadTheme(this.theme);
  }

  public generateProfilePicture(address: string): Observable<SafeResourceUrl> {
    const url = blockies.create({ seed: address, size: 10, scale: 4 }).toDataURL();
    return of(url);
  }

  private _detectPrefersColorScheme() {
    // dark is default
    let detectedMode: ThemeMode = 'dark';
    // Detect if prefers-color-scheme is supported
    if (window.matchMedia('(prefers-color-scheme)').media !== 'not all') {
      // Set colorScheme to Dark if prefers-color-scheme is dark. Otherwise, set it to Light.
      detectedMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    this.store.dispatch(setDarkmode({ src: UIService.name, theme: detectedMode }));
  }
}
