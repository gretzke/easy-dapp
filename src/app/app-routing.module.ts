import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddContractComponent } from './components/pages/add-contract/add-contract.component';
import { HomeComponent } from './components/pages/home/home.component';

const routes: Routes = [
  {
    path: '',
    component: AddContractComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
