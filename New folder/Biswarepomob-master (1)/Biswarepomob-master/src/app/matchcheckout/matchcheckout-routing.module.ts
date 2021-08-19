import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MatchcheckoutPage } from './matchcheckout.page';

const routes: Routes = [
  {
    path: '',
    component: MatchcheckoutPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MatchcheckoutPageRoutingModule {}
