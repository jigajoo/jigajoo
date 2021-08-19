import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BlockuserPage } from './blockuser.page';

const routes: Routes = [
  {
    path: '',
    component: BlockuserPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BlockuserPageRoutingModule {}
