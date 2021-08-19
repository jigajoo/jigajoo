import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Profilebuilder2Page } from './profilebuilder2.page';

const routes: Routes = [
  {
    path: '',
    component: Profilebuilder2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Profilebuilder2PageRoutingModule {}
