import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MappointPage } from './mappoint.page';

const routes: Routes = [
  {
    path: '',
    component: MappointPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MappointPageRoutingModule {}
