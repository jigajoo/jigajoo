import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserratingPage } from './userrating.page';

const routes: Routes = [
  {
    path: '',
    component: UserratingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserratingPageRoutingModule {}
