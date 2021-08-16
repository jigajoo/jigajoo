import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Profilebuilder3Page } from './profilebuilder3.page';

const routes: Routes = [
  {
    path: '',
    component: Profilebuilder3Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Profilebuilder3PageRoutingModule {}
