import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
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
import { environment } from 'src/environments/environment';
import { AppEffects } from './store/app.effects';
import { HomeComponent } from './components/pages/home/home.component';
import { AddContractComponent } from './components/pages/add-contract/add-contract.component';
import { LoaderComponent } from './components/etc/loader/loader.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContractInteractionComponent } from './components/pages/contract-interaction/contract-interaction.component';
import { ReadFieldComponent } from './components/pages/contract-interaction/read-field/read-field.component';
import { WriteFieldComponent } from './components/pages/contract-interaction/write-field/write-field.component';
import { ContractInputFieldComponent } from './components/pages/contract-interaction/contract-input-field/contract-input-field.component';
import { ToastrModule } from 'ngx-toastr';
import { EnsureInputDirective } from './directives/ensure-input.directive';
import { PendingTxComponent } from './components/header/pending-tx/pending-tx.component';
import { contractStateReducer, contractStateKey } from './components/pages/contract-interaction/store/contract.reducer';
import {
  pendingTxLocalStorageSyncReducer,
  pendingTxReducer,
  pendingTxStateKey,
} from './components/header/pending-tx/store/pendingtx.reducer';
import { PendingTxEffects } from './components/header/pending-tx/store/pendingtx.effects';
import { ContractEffects } from './components/pages/contract-interaction/store/contract.effects';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EditTextDirective } from './directives/edit-text.directive';
import { EditInputComponent } from './components/pages/contract-interaction/edit-input/edit-input.component';
import { EditTextAreaComponent } from './components/pages/contract-interaction/edit-text-area/edit-text-area.component';

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
    HomeComponent,
    AddContractComponent,
    LoaderComponent,
    ContractInteractionComponent,
    ReadFieldComponent,
    WriteFieldComponent,
    ContractInputFieldComponent,
    EnsureInputDirective,
    PendingTxComponent,
    EditTextDirective,
    EditInputComponent,
    EditTextAreaComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    StoreModule.forRoot(reducers, { metaReducers: [localStorageSyncReducer] }),
    StoreModule.forFeature(contractStateKey, contractStateReducer),
    StoreModule.forFeature(pendingTxStateKey, pendingTxReducer, { metaReducers: [pendingTxLocalStorageSyncReducer] }),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
    }),
    EffectsModule.forRoot([AppEffects, PendingTxEffects, ContractEffects]),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    BrowserAnimationsModule,
    NgParticlesModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      progressBar: true,
    }),
    FontAwesomeModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
