import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MappointPageRoutingModule } from './mappoint-routing.module';

import { MappointPage } from './mappoint.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MappointPageRoutingModule
  ],
  declarations: [MappointPage]
})
export class MappointPageModule {}
