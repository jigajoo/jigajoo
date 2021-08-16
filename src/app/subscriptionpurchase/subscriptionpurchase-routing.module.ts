import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubscriptionpurchasePage } from './subscriptionpurchase.page';

const routes: Routes = [
  {
    path: '',
    component: SubscriptionpurchasePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubscriptionpurchasePageRoutingModule {}
