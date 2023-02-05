import { DOCUMENT } from '@angular/common';
import { ApplicationRef, ComponentRef, Inject, Injectable, PlatformRef } from '@angular/core';
import {
  GoogleAnalyticsInitializer,
  GoogleAnalyticsRouterInitializer,
  GoogleAnalyticsService,
  GtagFn,
  IGoogleAnalyticsSettings,
  NGX_GOOGLE_ANALYTICS_SETTINGS_TOKEN,
  NGX_GTAG_FN,
} from 'ngx-google-analytics';
import { AppModule } from '../app.module';
import { AppComponent } from '../components/app.component';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private ref!: ComponentRef<AppComponent>;
  constructor(
    @Inject(NGX_GOOGLE_ANALYTICS_SETTINGS_TOKEN) private settings: IGoogleAnalyticsSettings,
    @Inject(NGX_GTAG_FN) private gtag: GtagFn,
    @Inject(DOCUMENT) private document: Document,
    private googleAnalyticsService: GoogleAnalyticsService
  ) {}

  public async init(component: ComponentRef<AppComponent>) {
    this.ref = component;
    // TODO: cookie consent
    await GoogleAnalyticsInitializer(this.settings, this.gtag, this.document)();
    await GoogleAnalyticsRouterInitializer({}, this.googleAnalyticsService)(this.ref);
  }
}
