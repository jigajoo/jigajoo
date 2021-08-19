import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FeatureduserPage } from './featureduser.page';

const routes: Routes = [
  {
    path: '',
    component: FeatureduserPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeatureduserPageRoutingModule {}
