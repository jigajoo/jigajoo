import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TermOfServicesPageRoutingModule } from './term-of-services-routing.module';

import { TermOfServicesPage } from './term-of-services.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TermOfServicesPageRoutingModule
  ],
  declarations: [TermOfServicesPage]
})
export class TermOfServicesPageModule {}
