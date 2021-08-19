import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Profilebuilder1Page } from './profilebuilder1.page';

const routes: Routes = [
  {
    path: '',
    component: Profilebuilder1Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Profilebuilder1PageRoutingModule {}
