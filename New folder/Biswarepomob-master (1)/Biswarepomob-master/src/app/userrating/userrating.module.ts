import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserratingPageRoutingModule } from './userrating-routing.module';

import { UserratingPage } from './userrating.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserratingPageRoutingModule
  ],
  declarations: [UserratingPage]
})
export class UserratingPageModule {}
