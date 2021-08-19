import { Component, OnInit } from '@angular/core';
import { AuthService } from "../services/auth.service";
import { GlobalVarService } from "../services/global-var.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationExtras } from "@angular/router";
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
//import { Facebook } from '@ionic-native/facebook/ngx';
import { Observable } from 'rxjs';
import { Device } from '@ionic-native/device';
import { ApiService } from "../services/api.service";
// import { Facebook } from '@ionic-native/facebook/ngx';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
// import { FCM } from '@ionic-native/fcm';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth   } from "@angular/fire/auth";
import * as firebase from 'firebase';
import { LoadingController, ToastController, Platform } from "@ionic/angular";

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {

  loginForm;
  obVar: any = {};
  UserDetail: any;
  userExists:boolean;
  FCMToken:string;
  feature=[];
  jigajoo_login_username : string = "";
  jigajoo_login_password : string = "";
  name: string;
  items: any;
  myToast: any;

  constructor(
    private _authSrc: AuthService,
    private _gblSrc: GlobalVarService,
    private apiservice: ApiService,
    private formBuilder: FormBuilder,
    private afauth: AngularFireAuth,
    private router: Router,
    private loader: LoadingController,
    private toast: ToastController,
    private storage: Storage,
    public http: HttpClient,public fb: Facebook, private platform: Platform,
    public loadingCtrl: LoadingController,
  ) { 
     /* if(platform.is('cordova'))
      {
        this.fcm.getToken().then(token=>{
          console.log('FCM Token is: '+token);
          this.FCMToken=token;
          this.storage.set('token',this.FCMToken);
        })

        platform.ready().then(() => {
          fcm.onNotification().subscribe( data => {
          if(data.wasTapped){
            console.log('Notification was received on device tray and tapped by the user.'+JSON.stringify(data));
          }else{
            console.log('Notification was received in foreground. Maybe the user needs to be notified.'+JSON.stringify(data));
          }
          });
        });
      }
      else
        console.log('I am in Browser.....');

        let responseData : Observable<any>;
        responseData = this.http.get('http://jigaju.esy.es/api/get_all_configuration');
        responseData.subscribe(data => {
          this._gblSrc.promotion=data.is_promotion;
        });
    */
  }

  async ngOnInit() {

    this.loginForm = this.formBuilder.group({
      userName: ["schoolmojo1@gmail.com"],
      passWord: ["password"]
    });
    //await this.storage.create();
    // this.obVar.email = this.loginForm.value.email
  }

  signup(){
    this.router.navigate(["/signup"]);
  }

  async signin() {
    const loading = await this.loader.create({
      cssClass: 'my-custom-class',
      message: 'Logging In...',
      duration: 2000
    });
    await loading.present();

    this.obVar.email = this.loginForm.value.userName;
    this.obVar.password = this.loginForm.value.passWord;

    console.log("email", this.loginForm.value.userName);
    console.log("password", this.loginForm.value.passWord);

    let res = await this._authSrc.login(this.loginForm.value.userName, this.loginForm.value.passWord).then(data => {
      console.log("Data1", data);
      this.login(loading);
      localStorage.setItem("isLogin","true");
    }).catch(async (err) => {
      const toast = await this.toast.create({
        message: 'Invalid Username or Password',
        duration: 2000
      });
      toast.present();
    })

  }

  async login(loading) {
    let postData = new FormData();
    let apiEndPoint = "/api/loginApi_APP";
    postData.append('email', this.loginForm.value.userName);
    postData.append('device_token', this.loginForm.value.userName + '_Browser');
    postData.append('device', 'browser');
    await this._authSrc.postApiCall(apiEndPoint, postData).then(data => {
      console.log("Data2", data);
      loading.dismiss();
      this.storage.set('name', { "id": data['loginUserDetails']['id'] });
      localStorage.setItem("uid",data['loginUserDetails']['id']);
      this._gblSrc.currentUserDetails = data['loginUserDetails'];
      this._gblSrc.userId = data['loginUserDetails']['id'];
      this.router.navigate(["/home"])
    }).catch(async (err) => {
      const toast = await this.toast.create({
        message: 'There is some Problem',
        duration: 3000
      });
      toast.present();
    });


    // this.nav.navigateRoot(["/home"], { skipLocationChange: true })
  }


  passwordreset() {
    this.router.navigate(['passwordreset']);
  }


    async FBLogin(){
      let loader = await this.loadingCtrl.create({
        message: "Logging ...."
      });
      await loader.present();
      this.fb.login(['public_profile', 'email'])
        .then(async (res: FacebookLoginResponse) => {
          console.log('res FB ' +JSON.stringify(res));
          /*if(res.status == "connected") {
            var provider = new firebase.FacebookAuthProvider();
            const facebookCredential = provider.credential(res.authResponse.accessToken);
            let responseData : Promise<any>;
            responseData=<any>this.afauth.signInWithCredential(facebookCredential);
            responseData.then(success => {                    
              this.createUser(success.uid,success.displayName,success.email,success.photoURL,loader);
              //console.log("Firebase success: " + JSON.stringify(success)); 
            },async onerror=>{
              await loader.dismiss();
              console.log(onerror.message);
              this.myToast = await this.toast.create({
                message: 'Fail to Login By FB '+onerror.message,
                duration: 3000
              });
              this.myToast.present();
            });
          } 
          else {
            await loader.dismiss(); 
            var a = await this.toast.create({
              message: 'Unable to Connect to FB.' + res.status,
              duration: 3000
            });
            a.present(); 
          } */
        }).catch(async (e) => {
          console.log('Error While Connecting FB ' +JSON.stringify(e));
          console.log('Error While Connecting FB ' +e.errorMessage);
          await loader.dismiss();

          var a = await this.toast.create({
            message: 'Unable to Connect to FB !! '+JSON.stringify(e.errorMessage),
            duration: 3000
          });
          a.present(); 
        });
    }

    async createUser(UID,displayName,email,profile_image,loader)
    {
      let postData= new FormData();
      var API_URL='http://jigaju.esy.es/api/registerUser';
      postData.append('email',email);
      postData.append('fname',displayName);
      postData.append('UID',UID);  // Setting Firebase UID for Chatting

      if(this.FCMToken){
        postData.append('device_token',this.FCMToken); // Setting Device Token Notification
        //postData.append('device',this.device.platform);
        postData.append('device','android');
      } 
      else{
        postData.append('device_token',email+'_Browser'); 
        postData.append('device','browser');
      }       

      let responseData : Observable<any>;
      responseData = this.http.post(API_URL,postData);
      responseData.subscribe(async data => {
          //console.log(JSON.stringify(data));                        
        if(data && !data.error) {
          responseData =this.http.post('http://jigaju.esy.es/api/loginApi_APP',postData); // Login Registered User into System        
          responseData.subscribe(respond =>{
            console.log('loginApi_APP return Data : '+ JSON.stringify(respond));
            console.log('id is '+respond.loginUserDetails.id)
            this.storage.set('name',{"id":respond.loginUserDetails.id})  // Store User in Local Storage
            .then(storageData=>{
              loader.dismiss();
              if(!data.exists){         
                this._authSrc.create_user(displayName,email,profile_image);  // User User in FireBase                 
                this.apiservice.buySubscription(respond.loginUserDetails.id,'1','','',1,'Subscription'); // Buy Free Subscription on Registration 
                if(this._gblSrc.promotion)
                  this.apiservice.buySubscription(respond.loginUserDetails.id,'4',30,'month',1,'Subscription'); // Buy platinum Subscription on Registration for one month
                //this.navCtrl.setRoot(Profilebuilder1Page,{id:respond.loginUserDetails.id}); 
                let navigationExtras: NavigationExtras = {
                     queryParams: {
                       id: respond.loginUserDetails.id
                     }
                   }; 
                this.router.navigate(['profilebuilder1']);        
              }
              else            
                // this.navCtrl.setRoot(SidemenuPage);
                this.router.navigate(['home']);
            });         
          });               
        }  
        else {
          await loader.dismiss();
          var a = await this.toast.create({
            message: data.message,
            duration: 3000
          });
          a.present();
        } 
      },async onerror=>{ 
          await loader.dismiss(); 
          var a = await this.toast.create({
              message: 'Unable to Login '+onerror.message,
              duration: 3000
            })
          a.present();
      })
      }


    toc(){
      
      this.router.navigate(['term-of-services']);
    }  
}
