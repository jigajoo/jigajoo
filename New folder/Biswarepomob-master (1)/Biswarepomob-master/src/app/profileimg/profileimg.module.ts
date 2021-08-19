import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileimgPageRoutingModule } from './profileimg-routing.module';

import { ProfileimgPage } from './profileimg.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfileimgPageRoutingModule
  ],
  declarations: [ProfileimgPage]
})
export class ProfileimgPageModule {}
