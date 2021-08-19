import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase';

@Injectable()
export class UserProvider {
  firedata = firebase.database().ref('/users');
  constructor(public afireauth: AngularFireAuth) {
   
  }

  /* This Function Register User in Firebase for chatting Functionality
  // Input Email Address and Name
  //--------------------------------------------------------------------*/
  register_user_firebase(email:string,password:string,input_name:string,Profile_image:string)
	{
    var promise = new Promise((resolve, reject) => {
         this.afireauth.auth.createUserWithEmailAndPassword(email, password).then(() => {
            this.afireauth.auth.currentUser.updateProfile({
                displayName: input_name,
                photoURL: Profile_image
            }).then(() => {
                            this.firedata.child(this.afireauth.auth.currentUser.uid).set({
                              uid: this.afireauth.auth.currentUser.uid,
                              displayName: input_name,
                              photoURL: Profile_image
                            }).then(() => {                                
                                resolve({ success: true,firebase_UID:this.afireauth.auth.currentUser.uid});
                            }).catch((err) => {
                              reject(err);
                            })
                        }).catch((err) => {
                          reject(err);
                        })
            }).catch((err) => {
              reject(err);
            })
        })
        return promise;
	}

   /*
  
  For updating the users collection and the firebase users list with
  the imageurl of the profile picture stored in firebase storage.
  Called from - profilepic.ts
  Inputs - Url of the image stored in firebase.
  OUtputs - Promise.
  
  */

  updateimage(imageurl) {
      var promise = new Promise((resolve, reject) => {
              firebase.database().ref('/users/' + firebase.auth().currentUser.uid).update({
              displayName: this.afireauth.auth.currentUser.displayName,
              photoURL: imageurl,
              uid: firebase.auth().currentUser.uid
              }).then(() => {
                  resolve({ success: true });
                  }).catch((err) => {
                      reject(err);
                  }) 
      })
      return promise;
  }

  getuserdetails() {
    var promise = new Promise((resolve, reject) => {
    this.firedata.child(firebase.auth().currentUser.uid).once('value', (snapshot) => {
      resolve(snapshot.val());
    }).catch((err) => {
      reject(err);
      })
    })
    return promise;
  }

  create_user(input_name,email,Profile_image){
    var promise = new Promise((resolve) => {this.firedata.child(this.afireauth.auth.currentUser.uid).set({
        uid: this.afireauth.auth.currentUser.uid,
        displayName: input_name,
        photoURL: Profile_image
      }).then(() => {                                
        resolve({ success: true});
      }).catch((err) => {
        resolve({ success: false,message:err.message});       
      })
    });
    return promise;
  }

  updatedisplayname(newname) {
    var promise = new Promise((resolve, reject) => {
      this.afireauth.auth.currentUser.updateProfile({
      displayName: newname,
      photoURL: this.afireauth.auth.currentUser.photoURL
    }).then(() => {
      this.firedata.child(firebase.auth().currentUser.uid).update({
        displayName: newname,
        photoURL: this.afireauth.auth.currentUser.photoURL,
        uid: this.afireauth.auth.currentUser.uid
      }).then(() => {
        resolve({ success: true });
      }).catch((err) => {
        reject(err);
      })
      }).catch((err) => {
        reject(err);
    })
    })
    return promise;
  }

  getallusers() {
    var promise = new Promise((resolve, reject) => {
      this.firedata.orderByChild('uid').once('value', (snapshot) => {
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

  passwordreset(email) {
    var promise = new Promise((resolve, reject) => {
      firebase.auth().sendPasswordResetEmail(email).then(() => {
        resolve({ success: true });
      }).catch((err) => {
        resolve({ success: false ,message: err.message});
        console.log(err.message);
      })
    })
    return promise;
  }

  logout()
  {
    firebase.auth().signOut().then(function() {
      console.log('Signout from Firebase successfully');
    })
    .catch(function(error) {
      console.log('Failed to Signout from Firebase :'+error.message);
    });
  }
}
