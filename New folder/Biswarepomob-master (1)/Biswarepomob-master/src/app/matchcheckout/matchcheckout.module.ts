import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MatchcheckoutPageRoutingModule } from './matchcheckout-routing.module';

import { MatchcheckoutPage } from './matchcheckout.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatchcheckoutPageRoutingModule
  ],
  declarations: [MatchcheckoutPage]
})
export class MatchcheckoutPageModule {}
