import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BlockuserPageRoutingModule } from './blockuser-routing.module';

import { BlockuserPage } from './blockuser.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BlockuserPageRoutingModule
  ],
  declarations: [BlockuserPage]
})
export class BlockuserPageModule {}
