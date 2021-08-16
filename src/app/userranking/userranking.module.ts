import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserrankingPageRoutingModule } from './userranking-routing.module';

import { UserrankingPage } from './userranking.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserrankingPageRoutingModule
  ],
  declarations: [UserrankingPage]
})
export class UserrankingPageModule {}
