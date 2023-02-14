import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddContractComponent } from './components/pages/add-contract/add-contract.component';
import { ContractInteractionComponent } from './components/pages/contract-interaction/contract-interaction.component';
import { HomeComponent } from './components/pages/home/home.component';
import { ProfileComponent } from './components/pages/profile/profile.component';
import { WalletResolver } from './resolver/WalletResolver';

const routes: Routes = [
  { path: 'new-dapp', component: AddContractComponent },
  { path: 'new-dapp/:address', component: AddContractComponent },
  { path: 'app/:owner/:url', component: ContractInteractionComponent },
  { path: 'app/:owner/:url/:address', component: ContractInteractionComponent },
  { path: 'user/:address', component: ProfileComponent },
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
