import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouteReuseStrategy } from '@angular/router';

import { IonicRouteStrategy } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Profilebuilder1PageRoutingModule } from './profilebuilder1-routing.module';

import { Profilebuilder1Page } from './profilebuilder1.page';


import { Camera } from '@ionic-native/camera/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { File } from '@ionic-native/file/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    Profilebuilder1PageRoutingModule
  ],
  providers: [
    Camera,
    Geolocation,
    File,
    FileTransfer,
    NativeGeocoder,
    { 
      provide: RouteReuseStrategy, 
      useClass: IonicRouteStrategy, 
    },
  ],
  declarations: [Profilebuilder1Page]
})
export class Profilebuilder1PageModule {}
