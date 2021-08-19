import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TermOfServicesPage } from './term-of-services.page';

const routes: Routes = [
  {
    path: '',
    component: TermOfServicesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TermOfServicesPageRoutingModule {}
