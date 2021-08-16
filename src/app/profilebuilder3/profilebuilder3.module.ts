import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Profilebuilder3PageRoutingModule } from './profilebuilder3-routing.module';

import { Profilebuilder3Page } from './profilebuilder3.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Profilebuilder3PageRoutingModule
  ],
  declarations: [Profilebuilder3Page]
})
export class Profilebuilder3PageModule {}
