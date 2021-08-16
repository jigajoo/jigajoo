import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFireDatabase } from '@angular/fire/database';

import { NavController, LoadingController, ToastController } from "@ionic/angular";
import { GlobalVarService } from "./global-var.service";
import { HttpClient } from "@angular/common/http";
import { Storage } from '@ionic/storage';

// import { error } from 'node:console';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
useravail= false;
uid:any;
  constructor(
    private nav: NavController,
    private afauth: AngularFireAuth,
    private _gblSrc: GlobalVarService,
    private loader: LoadingController,
    private toast: ToastController,
    private storage: Storage,
    private http: HttpClient,public db: AngularFireDatabase
  ) {
    afauth.onAuthStateChanged((user) => {
      console.log("user 23", user);
      if (user) {
        this.useravail = true;
        this.uid= user.uid;
        user.getIdToken().then(idToken => {
          this._gblSrc.token = idToken;
          console.log("Token", this._gblSrc.token);
          console.log("Got the token");
          // this.nav.navigateRoot(["/home"])
        })
      } 
    })
  }

  async ngOnInit() {
  }

  async login(email: string, password: string) {
    let res = await this.afauth.signInWithEmailAndPassword(email, password);
    return res;
  }
  getuser(){
    this.storage.get('name').then( id=>
      {
        if(id){
          console.log("54444444444444444444444");
          this.useravail = true;
          return true;

        }
      });
  }

  isLogin(){
      const data = localStorage.getItem("isLogin");
     return data;
   // return rvalue; 
   
  }

  postApiCall(apiEndPoint, data){
    let apiUrl = this._gblSrc.baseUrl + apiEndPoint;
    let res = this.http.post(apiUrl, data).toPromise();
    return res;
  }

  async signup(email: string, password: string ,input_name:string,Profile_image:string) {
    let res = await this.afauth.createUserWithEmailAndPassword(email, password);
    this.afauth.currentUser.then(u =>
    { 
      console.log("user",u);    
      var uid = u.uid;
      u.updateProfile({
        displayName: input_name,
        photoURL: Profile_image
    }).then(() => {
                    this.db.database.ref().child('users') .child(uid).set({
                      uid: uid,
                      displayName: input_name,
                      photoURL: Profile_image
                    }).then(() => {   
                      console.log("updated");                             
                        //resolve({ success: true,firebase_UID:this.afauth.auth.currentUser.uid});
                    }).catch((err) => {
                      console.log("err",err);      
                      //reject(err);
                    })
                }).catch((err) => {
                  console.log("err",err);    
                  //reject(err);
                })
    }).catch((err) => {
      console.log("err",err);    
      //reject(err);
    })
    return res;
  }

  passwordreset(email) {
    var promise = new Promise((resolve, reject) => {
      this.afauth.sendPasswordResetEmail(email).then(() => {
        resolve({ success: true });
      }).catch((err) => {
        resolve({ success: false ,message: err.message});
        console.log(err.message);
      })
    })
    return promise;
  }
  updateimage(imageurl) {
      var promise = new Promise((resolve, reject) => {
        this.afauth.onAuthStateChanged((user) => {
          this.db.database.ref('/users/' + user.uid).update({
          displayName: user.displayName,
          photoURL: imageurl,
          uid: user.uid
          }).then(() => {
              resolve({ success: true });
              }).catch((err) => {
                  reject(err);
              }) 
        });
              
      })
      return promise;
  }

  create_user(input_name,email,Profile_image){
    var promise = new Promise((resolve) => {
       this.afauth.onAuthStateChanged((user) => {
          this.db.database.ref('users').child(user.uid).set({
            uid: user.uid,
            displayName: input_name,
            photoURL: Profile_image
          }).then(() => {                                
            resolve({ success: true});
          }).catch((err) => {
            resolve({ success: false,message:err.message});       
          })
       });
      
    });
    return promise;
  }

  updatedisplayname(newname) {
    var promise = new Promise((resolve, reject) => {
      this.afauth.onAuthStateChanged((user) => {
          this.afauth.currentUser.then((u) => {
            u.updateProfile({
                  displayName: newname,
                  photoURL: user.photoURL
                }).then(() => {
                  this.db.database.ref('users').child(user.uid).update({
                    displayName: newname,
                    photoURL: user.photoURL,
                    uid: user.uid
                  }).then(() => {
                    resolve({ success: true });
                  }).catch((err) => {
                    reject(err);
                  })
                  }).catch((err) => {
                    reject(err);
              })
          })
      });
      
    })
    return promise;
  }


  getallusers() {
    var promise = new Promise((resolve, reject) => {
      this.db.database.ref('users').orderByChild('uid').once('value', (snapshot) => {
        let userdata = snapshot.val();
        let temparr = [];
        for (var key in userdata) {
            temparr.push(userdata[key]);
        }
        resolve(temparr);
      }).catch((err) => {
        reject(err);
      })
    })
    return promise;
  }

  async resetPassword(email:string){
    let res = await this.afauth.sendPasswordResetEmail(email);
    return res;
  }

  async logout() {
    await this.afauth.signOut().then(() => {
      console.log("Logged Out ");
      localStorage.setItem("isLogin","false");
      this.storage.set('name', '');
      this._gblSrc.userId='';
      this._gblSrc.currentUserDetails={};
    }).catch((error) => {
      console.log(error);
    })
  }







}
