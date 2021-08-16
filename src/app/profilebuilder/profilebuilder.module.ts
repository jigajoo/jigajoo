import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilebuilderPageRoutingModule } from './profilebuilder-routing.module';

import { ProfilebuilderPage } from './profilebuilder.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilebuilderPageRoutingModule
  ],
  declarations: [ProfilebuilderPage]
})
export class ProfilebuilderPageModule {}
