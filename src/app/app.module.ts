import { NgModule } from '@angular/core';
import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
// import { IonicStorageModule } from '@ionic/storage';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";

import {FormsModule, ReactiveFormsModule, NgControl} from '@angular/forms';

import { IonicStorageModule } from '@ionic/storage-angular';

import { environment } from "../environments/environment";

import { Camera } from '@ionic-native/camera/ngx';
//import { Crop } from '@ionic-native/crop';
import { File } from '@ionic-native/file/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import {HttpClientModule} from '@angular/common/http';
//import { InAppPurchase } from '@ionic-native/in-app-purchase/ngx';
import {Events} from './services/events.service';

// import * as firebase from 'firebase';
import { Facebook } from '@ionic-native/facebook/ngx';
// firebase.initializeApp(environment.firebase);
import { InAppPurchase2 } from '@ionic-native/in-app-purchase-2/ngx';
import { InAppPurchase } from '@ionic-native/in-app-purchase/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
    HammerModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),

    AngularFireAuthModule,
    IonicStorageModule.forRoot()

    ],
  providers: [Camera,
    Geolocation,
    File,
    FileTransfer,
    NativeGeocoder,
    //InAppPurchase,
    InAppPurchase,
    InAppPurchase2,
    Facebook,
    Events,
    { 
      provide: RouteReuseStrategy, 
      useClass: IonicRouteStrategy, 
    },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
