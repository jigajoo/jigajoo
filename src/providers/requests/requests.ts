import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Events } from '../../app/services/events.service';
import { UserProvider } from '../user/user';
import { GlobalVariableProvider } from '../global-variable/global-variable';
import firebase from 'firebase';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { InAppPurchase2, IAPProduct } from '@ionic-native/in-app-purchase-2';


/*
  Generated class for the RequestsProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class RequestsProvider {
  firereq = firebase.database().ref('/requests');
  firefriends = firebase.database().ref('/friends');
  firedata = firebase.database().ref('/users');
  
  userdetails;
  myfriends;
  userEligiableFeatureList=<any>[];
  consumeFromPackage:string;
  constructor(public userservice: UserProvider, public events: Events,public http:HttpClient,public platform:Platform,private store: InAppPurchase2,public globalVariableProvider:GlobalVariableProvider) {
    
  }

  sendrequest(recipient:string,sender:string) {
    var promise = new Promise((resolve, reject) => {
      this.firereq.child(recipient).push({
      sender: sender
      }).then(() => {
        resolve({ success: true });
        }).catch((err) => {
          resolve({ success: false,'message':err.message });
        })
    });
    return promise;  
  }

  getmyrequests() {
    let allmyrequests;
    var myrequests = [];
    this.firereq.child(firebase.auth().currentUser.uid).on('value', (snapshot) => {
      allmyrequests = snapshot.val();
      myrequests = [];
      for (var i in allmyrequests) {
        myrequests.push(allmyrequests[i].sender);
      }
      this.userservice.getallusers().then((res) => {
        var allusers = <any>res;
        //console.log(myrequests);
        //console.log(allusers);
        this.userdetails = [];
        for (var j in myrequests)
          for (var key in allusers) {            
            if (myrequests[j] === allusers[key].uid) {
              this.userdetails.push(allusers[key]);
            }
          }
        this.events.publish('gotrequests');
      })

  })
  }  

  acceptrequest(accepter:string,sender:string) {
      console.log(accepter+'  '+sender);
      var promise = new Promise((resolve, reject) => {
      this.myfriends = [];
      this.firefriends.child(sender).push({
        uid: accepter
      }).then(() => {
        this.firefriends.child(accepter).push({
              uid: firebase.auth().currentUser.uid
            }).then(() => {
                this.deleterequest(accepter,sender).then(() => {
                    resolve({'success':true});
                })
              })
        })
      });   
    return promise;
  }

  deleterequest(accepter:string,senderUID:string) {
    console.log(accepter+" "+senderUID);
    var promise = new Promise((resolve, reject) => {
     this.firereq.child(accepter).orderByChild('sender').equalTo(senderUID).once('value', (snapshot) => {
          let somekey;
          for (var key in snapshot.val())
            somekey = key;
            this.firereq.child(accepter).child(somekey).remove().then(() => {
            resolve(true);
          })
         })
          .then(() => {
          
        }).catch((err) => {
          reject(err);
        })
    })
    return promise; 
  }

  getmyfriends() {
    let friendsuid = [];
    this.firefriends.child(firebase.auth().currentUser.uid).on('value', (snapshot) => {
      let allfriends = snapshot.val();
      console.log(allfriends);
      this.myfriends = [];
      for (var i in allfriends)
        friendsuid.push(allfriends[i].uid);
        
      this.userservice.getallusers().then((users) => {
        this.myfriends = [];
        for (var j in friendsuid)
          for (var key in <any>users) {
            if (friendsuid[j] === users[key].uid) {
              this.myfriends.push(users[key]);
            }
          }
        this.events.publish('friends');
      }).catch((err) => {
        alert(err);
      })
    
    })
  } 
  
  getuserdetails(userID:string) {
    var promise = new Promise((resolve, reject) => {
    this.firedata.child(userID).once('value', (snapshot) => {
      resolve(snapshot.val());
    }).catch((err) => {
      reject(err);
      })
    })
    return promise;
  }

  configurePurchasing() {
    if (!this.platform.is('cordova')) { return; }
      console.log('Starting Configurations');

      //--------- Get All Products From DB --------------
      let postData= new FormData();
      let API_URL='http://jigaju.esy.es/api/Get_InAPP_Purchase_products_APP';
      postData.append('userid','');
      let responseData : Observable<any>;
      responseData = this.http.post(API_URL,postData);    
      responseData.subscribe(products => {
        console.log(JSON.stringify(products));
        this.store.verbosity = this.store.DEBUG;
        let productList=products;
        for(let i=0;i<productList.length;i++) {
            console.log('Product ID:'+productList[i].Product_ID+'  Product Type:'+productList[i].Product_Type);
            this.store.register({
              id: productList[i].Product_ID,
              type: productList[i].Product_Type, //  data.product_type,
              alias: ''
            });

            // Register event handlers for the specific product
            this.store.when(productList[i].Product_ID).registered( (product: IAPProduct) => {
              console.log('Registered: ' + JSON.stringify(product) +', Nishanto execute something.....');
            });

            // Updated
            this.store.when(productList[i].Product_ID).updated( (product: IAPProduct) => {
              console.log('Updated' + JSON.stringify(product) +', Nishanto execute something.....');
            });

            // Approve
            this.store.when(productList[i].Product_ID).approved( (product: IAPProduct) => {
              console.log('Approved' + JSON.stringify(product)+', Nishanto execute something.....');
              product.verify();
              product.finish();
              if(this.globalVariableProvider.flag!=1)
              this.buySubscription(this.globalVariableProvider.IAPUserID,this.globalVariableProvider.IAPPackageID,this.globalVariableProvider.IAPPackageValidity,this.globalVariableProvider.IAPPackagePeriod, this.globalVariableProvider.IAPPackagecount,this.globalVariableProvider.packageType);
            });



            // User closed the native purchase dialog
            this.store.when(productList[i].Product_ID).cancelled( (product) => {
                console.error('Purchase was Cancelled, Nishanto execute something.....');
            });

            // Track all store errors
            this.store.error( (err) => {
              console.error('Store Error ' + JSON.stringify(err));
            });
        }
        // Refresh the status of in-app products
        this.store.refresh();

        // Run some code only when the store is ready to be used
        // this.store.ready().then(()=>{
        //   console.log('Products: ' + JSON.stringify(this.store.products));
        //   console.log(JSON.stringify(this.store.get(productList[0].Product_ID)));
        // });
    },onerror=>{
      console.log(JSON.stringify(onerror));
  });
  }

	//----- Buy Subscription ----------------
	buySubscription(userid,packageid,validity,period,count,packageType){		
    let Data= new FormData();
    var URL='http://jigaju.esy.es/api/buySubscription_APP';
        Data.append('userid',userid);
        Data.append('subscriptionid', packageid);
        Data.append('validity',validity);
        Data.append('period',period);
        Data.append('count',count);
        Data.append('packageType',packageType);
        let resData : Observable<any>;
        resData = this.http.post(URL,Data);
        resData.subscribe(data => 
        {
          console.log(data);
          this.events.publish('userPurchase');
        });
  }

  
  getUserEligibleFeatures_APP(userID:string)
  {
    let postData= new FormData();
    var API_URL='http://jigaju.esy.es/api/getUserEligibleFeatures_APP';
    postData.append('userid', userID);

    let responseData : Observable<any>;
        responseData = this.http.post(API_URL,postData);
        responseData.subscribe(data => 
        {
          this.userEligiableFeatureList=data;
          console.log(this.userEligiableFeatureList);            
        });
  }

  consumeFeature(userID:string,featureID:string,packageID:string)
  {
    console.log('consume from package '+packageID);
    let postData= new FormData(); 
    let API_URL:string;
    postData.append('userid',userID); 
    postData.append('featureid',featureID);
    postData.append('package_id',packageID);
    API_URL='http://jigaju.esy.es/api/featureconsume_APP';
    return this.http.post(API_URL,postData);
  }

  checkUserFeature(featureID:string)
  {
    for(let i=0;i<this.userEligiableFeatureList.length;i++){
      if(this.userEligiableFeatureList[i].features_id == featureID){
          this.consumeFromPackage=this.userEligiableFeatureList[i].user_pack_id;
          return true;
      }
    }
    console.log('Feature not available '+featureID);
    return false;
  }
  
  consumeRightSwipeFeature(featureID:string)
  {
    for(let i=0;i<this.userEligiableFeatureList.length;i++){
      if(this.userEligiableFeatureList[i].features_id == featureID && this.userEligiableFeatureList[i].package_id != "1")
          return true;
    }
    return false;
  }

  consumeFreeRightSwipe(userID:string,featureID:string)
  {
    let postData= new FormData(); 
    let API_URL:string;
    postData.append('userid',userID); 
    postData.append('featureid',featureID);
    API_URL='http://jigaju.esy.es/api/consumeFreeRightSwipe_APP';
    return this.http.post(API_URL,postData);
  }
}
