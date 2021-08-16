import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FeatureduserPageRoutingModule } from './featureduser-routing.module';

import { FeatureduserPage } from './featureduser.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FeatureduserPageRoutingModule
  ],
  declarations: [FeatureduserPage]
})
export class FeatureduserPageModule {}
