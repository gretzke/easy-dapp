import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_BOOTSTRAP_LISTENER, APP_INITIALIZER, ComponentRef, forwardRef, NgModule, PlatformRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { popperVariation, provideTippyConfig, TippyDirective, tooltipVariation } from '@ngneat/helipopper';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgParticlesModule } from 'ng-particles';
import { ClipboardModule } from 'ngx-clipboard';
import {
  IGoogleAnalyticsSettings,
  NgxGoogleAnalyticsModule,
  NgxGoogleAnalyticsRouterModule,
  NGX_GOOGLE_ANALYTICS_SETTINGS_TOKEN,
} from 'ngx-google-analytics';
import { ToastrModule } from 'ngx-toastr';
import { CalendarModule } from 'primeng/calendar';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app.component';
import { BannerComponent } from './components/banner/banner.component';
import { BackgroundComponent } from './components/elements/background/background.component';
import { DappListItemComponent } from './components/elements/dapp-list/dapp-list-item/dapp-list-item.component';
import { DappListComponent } from './components/elements/dapp-list/dapp-list.component';
import { DividerComponent } from './components/elements/divider/divider.component';
import { IconComponent } from './components/elements/icon/icon.component';
import { LoaderComponent } from './components/elements/loader/loader.component';
import { SelectMenuComponent } from './components/elements/select-menu/select-menu.component';
import { SpinnerComponent } from './components/elements/spinners/spinner/spinner.component';
import { FooterComponent } from './components/footer/footer.component';
import { DarkmodeToggleComponent } from './components/header/darkmode-toggle/darkmode-toggle.component';
import { HeaderLogoComponent } from './components/header/header-logo/header-logo.component';
import { HeaderWalletButtonComponent } from './components/header/header-wallet-button/header-wallet-button.component';
import { HeaderComponent } from './components/header/header.component';
import { NetworkSelectionComponent } from './components/header/network-selection/network-selection.component';
import { PendingTxComponent } from './components/header/pending-tx/pending-tx.component';
import { PendingTxEffects } from './components/header/pending-tx/store/pendingtx.effects';
import {
  pendingTxLocalStorageSyncReducer,
  pendingTxReducer,
  pendingTxStateKey,
} from './components/header/pending-tx/store/pendingtx.reducer';
import { AddContractComponent } from './components/pages/add-contract/add-contract.component';
import { ApprovalHooksComponent } from './components/pages/contract-interaction/contract-config/approval-hooks/approval-hooks.component';
import { ContractSettingsComponent } from './components/pages/contract-interaction/contract-config/contract-config.component';
import { EnumConfigComponent } from './components/pages/contract-interaction/contract-config/enum-config/enum-config.component';
import { EnumInputComponent } from './components/pages/contract-interaction/contract-config/enum-config/enum-input/enum-input.component';
import { ContractHeaderComponent } from './components/pages/contract-interaction/contract-header/contract-header.component';
import { ContractInteractionComponent } from './components/pages/contract-interaction/contract-interaction.component';
import { FunctionComponent } from './components/pages/contract-interaction/function/function.component';
import { OutputFormatterComponent } from './components/pages/contract-interaction/function/read-field/output-formatter/output-formatter.component';
import { ReadFieldComponent } from './components/pages/contract-interaction/function/read-field/read-field.component';
import { WriteFieldComponent } from './components/pages/contract-interaction/function/write-field/write-field.component';
import { ArrayInputComponent } from './components/pages/contract-interaction/reusable/array-input/array-input.component';
import { AddressOutputConfigBarComponent } from './components/pages/contract-interaction/reusable/contract-input-field/address-output-config-bar/address-output-config-bar.component';
import { ContractInputFieldComponent } from './components/pages/contract-interaction/reusable/contract-input-field/contract-input-field.component';
import { UintInputConfigBarComponent } from './components/pages/contract-interaction/reusable/contract-input-field/uint-input-config-bar/uint-input-config-bar.component';
import { DynamicInputListComponent } from './components/pages/contract-interaction/reusable/dynamic-input-list/dynamic-input-list.component';
import { EditInputComponent } from './components/pages/contract-interaction/reusable/edit-input/edit-input.component';
import { EditTextAreaComponent } from './components/pages/contract-interaction/reusable/edit-text-area/edit-text-area.component';
import { StructArrayInputComponent } from './components/pages/contract-interaction/reusable/struct-array-input/struct-array-input.component';
import { StructInputComponent } from './components/pages/contract-interaction/reusable/struct-array-input/struct-input/struct-input.component';
import { ValueInputComponent } from './components/pages/contract-interaction/reusable/value-input/value-input.component';
import { ContractEffects } from './components/pages/contract-interaction/store/contract.effects';
import { contractStateKey, contractStateReducer } from './components/pages/contract-interaction/store/contract.reducer';
import { HomeComponent } from './components/pages/home/home.component';
import { ProfileComponent } from './components/pages/profile/profile.component';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { EnsureInputDirective } from './directives/ensure-input.directive';
import { SymbolDirective } from './directives/symbol.directive';
import { WalletResolver } from './resolver/WalletResolver';
import { AnalyticsService } from './services/analytics.service';
import { dappStorageKey, dappStorageReducer } from './services/dapps/store/dapps.reducer';
import { EthereumService } from './services/ethereum.service';
import { BlockNative } from './services/wallets/blocknative';
import { WalletConnect } from './services/wallets/web3modal';
import { AppEffects } from './store/app.effects';
import { localStorageSyncReducer, reducers } from './store/app.reducer';
import { FirebaseSpinnerComponent } from './components/elements/spinners/firebase-spinner/firebase-spinner.component';

const httpLoaderFactory = (http: HttpClient): TranslateHttpLoader => new TranslateHttpLoader(http, './assets/i18n/', '.json');

@NgModule({
  declarations: [
    AppComponent,
    BackgroundComponent,
    HeaderComponent,
    HeaderLogoComponent,
    DarkmodeToggleComponent,
    IconComponent,
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
    EditInputComponent,
    EditTextAreaComponent,
    FunctionComponent,
    ContractHeaderComponent,
    UintInputConfigBarComponent,
    ContractSettingsComponent,
    EnumConfigComponent,
    DynamicInputListComponent,
    EnumInputComponent,
    DividerComponent,
    OutputFormatterComponent,
    SelectMenuComponent,
    ApprovalHooksComponent,
    SymbolDirective,
    AddressOutputConfigBarComponent,
    StructInputComponent,
    StructArrayInputComponent,
    ArrayInputComponent,
    ValueInputComponent,
    ProfileComponent,
    NetworkSelectionComponent,
    BannerComponent,
    FooterComponent,
    DappListComponent,
    DappListItemComponent,
    SpinnerComponent,
    FirebaseSpinnerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    StoreModule.forRoot(reducers, {
      metaReducers: [localStorageSyncReducer],
    }),
    StoreModule.forFeature(contractStateKey, contractStateReducer),
    StoreModule.forFeature(dappStorageKey, dappStorageReducer),
    StoreModule.forFeature(pendingTxStateKey, pendingTxReducer, { metaReducers: [pendingTxLocalStorageSyncReducer] }),
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
    CommonModule,
    DragDropModule,
    CalendarModule,
    TippyDirective,
    ClipboardModule,
    NgxGoogleAnalyticsModule,
    NgxGoogleAnalyticsRouterModule,
    ...environment.modules,
  ],
  providers: [
    WalletResolver,
    provideTippyConfig({
      defaultVariation: 'tooltip',
      variations: {
        tooltip: tooltipVariation,
        popper: popperVariation,
      },
    }),
    {
      provide: APP_INITIALIZER,
      useFactory: (e: EthereumService) => {
        if (environment.walletType === 'web3modal') {
          return () => e.initWallet(new WalletConnect());
        } else {
          return () => e.initWallet(new BlockNative());
        }
      },
      multi: true,
      deps: [EthereumService],
    },
    {
      provide: NGX_GOOGLE_ANALYTICS_SETTINGS_TOKEN,
      useValue: {
        trackingCode: environment.googleAnalytics,
      },
    },
    {
      provide: APP_BOOTSTRAP_LISTENER,
      useFactory: (a: AnalyticsService) => (component: ComponentRef<AppComponent>) => a.init(component),
      multi: true,
      deps: [AnalyticsService],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
