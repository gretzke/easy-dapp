import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgParticlesModule } from 'ng-particles';
import { ToastrModule } from 'ngx-toastr';
import { CalendarModule } from 'primeng/calendar';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app.component';
import { BackgroundComponent } from './components/etc/background/background.component';
import { IconComponent } from './components/etc/icon/icon.component';
import { LoaderComponent } from './components/etc/loader/loader.component';
import { WalletModalComponent } from './components/etc/modals/wallet-modal/wallet-modal.component';
import { DarkmodeToggleComponent } from './components/header/darkmode-toggle/darkmode-toggle.component';
import { HeaderLinksComponent } from './components/header/header-links/header-links.component';
import { HeaderLogoComponent } from './components/header/header-logo/header-logo.component';
import { HeaderWalletButtonComponent } from './components/header/header-wallet-button/header-wallet-button.component';
import { HeaderComponent } from './components/header/header.component';
import { PendingTxComponent } from './components/header/pending-tx/pending-tx.component';
import { PendingTxEffects } from './components/header/pending-tx/store/pendingtx.effects';
import {
  pendingTxLocalStorageSyncReducer,
  pendingTxReducer,
  pendingTxStateKey,
} from './components/header/pending-tx/store/pendingtx.reducer';
import { AddContractComponent } from './components/pages/add-contract/add-contract.component';
import { ContractSettingsComponent } from './components/pages/contract-interaction/contract-config/contract-config.component';
import { ContractHeaderComponent } from './components/pages/contract-interaction/contract-header/contract-header.component';
import { ContractInteractionComponent } from './components/pages/contract-interaction/contract-interaction.component';
import { FunctionComponent } from './components/pages/contract-interaction/function/function.component';
import { ReadFieldComponent } from './components/pages/contract-interaction/function/read-field/read-field.component';
import { WriteFieldComponent } from './components/pages/contract-interaction/function/write-field/write-field.component';
import { ContractInputFieldComponent } from './components/pages/contract-interaction/reusable/contract-input-field/contract-input-field.component';
import { InputConfigBarComponent } from './components/pages/contract-interaction/reusable/contract-input-field/input-config-bar/input-config-bar.component';
import { EditInputComponent } from './components/pages/contract-interaction/reusable/edit-input/edit-input.component';
import { EditTextAreaComponent } from './components/pages/contract-interaction/reusable/edit-text-area/edit-text-area.component';
import { ContractEffects } from './components/pages/contract-interaction/store/contract.effects';
import { contractStateKey, contractStateReducer } from './components/pages/contract-interaction/store/contract.reducer';
import { HomeComponent } from './components/pages/home/home.component';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { EditTextDirective } from './directives/edit-text.directive';
import { EnsureInputDirective } from './directives/ensure-input.directive';
import { WalletResolver } from './resolver/WalletResolver';
import { EthereumService } from './services/ethereum.service';
import { AppEffects } from './store/app.effects';
import { localStorageSyncReducer, reducers } from './store/app.reducer';
import { EnumConfigComponent } from './components/pages/contract-interaction/contract-config/enum-config/enum-config.component';
import { DynamicInputListComponent } from './components/pages/contract-interaction/reusable/dynamic-input-list/dynamic-input-list.component';
import { EnumInputComponent } from './components/pages/contract-interaction/contract-config/enum-config/enum-input/enum-input.component';
import { DividerComponent } from './components/etc/divider/divider.component';
import { OutputFormatterComponent } from './components/pages/contract-interaction/function/read-field/output-formatter/output-formatter.component';
import { SelectMenuComponent } from './components/etc/select-menu/select-menu.component';
import { ApprovalHooksComponent } from './components/pages/contract-interaction/contract-config/approval-hooks/approval-hooks.component';

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
    FunctionComponent,
    ContractHeaderComponent,
    InputConfigBarComponent,
    ContractSettingsComponent,
    EnumConfigComponent,
    DynamicInputListComponent,
    EnumInputComponent,
    DividerComponent,
    OutputFormatterComponent,
    SelectMenuComponent,
    ApprovalHooksComponent,
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
    CommonModule,
    DragDropModule,
    CalendarModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (e: EthereumService) => e.ethereumFactory(),
      deps: [EthereumService],
    },
    WalletResolver,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
