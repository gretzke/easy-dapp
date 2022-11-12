import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgParticlesModule } from 'ng-particles';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app.component';
import { BackgroundComponent } from './components/etc/background/background.component';
import { HeaderLinksComponent } from './components/header/header-links/header-links.component';
import { HeaderComponent } from './components/header/header.component';
import { RemoveHostDirective } from './directives/remove-host.directive';
import { localStorageSyncReducer, reducers } from './store/app.reducer';
import { HeaderLogoComponent } from './components/header/header-logo/header-logo.component';
import { DarkmodeToggleComponent } from './components/header/darkmode-toggle/darkmode-toggle.component';
import { IconBellComponent } from './components/etc/icons/icon-bell/icon-bell.component';
import { IconMenuComponent } from './components/etc/icons/icon-menu/icon-menu.component';
import { IconMoonComponent } from './components/etc/icons/icon-moon/icon-moon.component';
import { IconSearchComponent } from './components/etc/icons/icon-search/icon-search.component';
import { IconSunComponent } from './components/etc/icons/icon-sun/icon-sun.component';
import { IconXComponent } from './components/etc/icons/icon-x/icon-x.component';

const httpLoaderFactory = (http: HttpClient): TranslateHttpLoader => new TranslateHttpLoader(http, './assets/i18n/', '.json');

@NgModule({
  declarations: [AppComponent, BackgroundComponent, HeaderComponent, HeaderLinksComponent, RemoveHostDirective, HeaderLogoComponent, DarkmodeToggleComponent, IconBellComponent, IconMenuComponent, IconMoonComponent, IconSearchComponent, IconSunComponent, IconXComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    StoreModule.forRoot(reducers, { metaReducers: [localStorageSyncReducer] }),
    EffectsModule.forRoot([]),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    BrowserAnimationsModule,
    NgParticlesModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
