import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfilebuilderPage } from './profilebuilder.page';

const routes: Routes = [
  {
    path: '',
    component: ProfilebuilderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilebuilderPageRoutingModule {}
