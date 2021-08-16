import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Profilebuilder2PageRoutingModule } from './profilebuilder2-routing.module';

import { Profilebuilder2Page } from './profilebuilder2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Profilebuilder2PageRoutingModule
  ],
  declarations: [Profilebuilder2Page]
})
export class Profilebuilder2PageModule {}
