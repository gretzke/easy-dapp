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
import { IconComponent } from './components/etc/icon/icon.component';
import { DarkmodeToggleComponent } from './components/header/darkmode-toggle/darkmode-toggle.component';
import { HeaderLinksComponent } from './components/header/header-links/header-links.component';
import { HeaderLogoComponent } from './components/header/header-logo/header-logo.component';
import { HeaderComponent } from './components/header/header.component';
import { localStorageSyncReducer, reducers } from './store/app.reducer';
import { WalletModalComponent } from './components/etc/modals/wallet-modal/wallet-modal.component';
import { HeaderWalletButtonComponent } from './components/header/header-wallet-button/header-wallet-button.component';
import { ClickOutsideDirective } from './directives/click-outside.directive';

const httpLoaderFactory = (http: HttpClient): TranslateHttpLoader => new TranslateHttpLoader(http, './assets/i18n/', '.json');

@NgModule({
  declarations: [
    AppComponent,
    BackgroundComponent,
    HeaderComponent,
    HeaderLinksComponent,
    HeaderLogoComponent,
    DarkmodeToggleComponent,
    IconComponent,
    WalletModalComponent,
    HeaderWalletButtonComponent,
    ClickOutsideDirective,
  ],
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
