import { Component, OnInit } from '@angular/core';
//import { NavParams, ToastController } from '@ionic/angular';
import {ToastController } from '@ionic/angular';

import { Router, NavigationExtras } from "@angular/router";
import { Events } from '../../app/services/events.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { AlertController } from '@ionic/angular';
// import { RequestsProvider } from '../../providers/requests/requests';
//import { SubscriptionpurchasePage } from '../subscriptionpurchase/subscriptionpurchase.page';
import { ApiService } from "../services/api.service";
import { GlobalVarService } from "../services/global-var.service";

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.page.html',
  styleUrls: ['./subscription.page.scss'],
})
export class SubscriptionPage implements OnInit {

  featureList=[];
  packageList=[];
  allPackageFeatures=[];
  allPackageName=[];
  featurePackageMatrix=[];
  content=[];
  feature=[];
  buyinfo:boolean=false;
  count:any;
  userID:any;
  period:any;
  packageid:any;
  validity:any;
  name:any;
  currency:any;
  rate:any;
  id:any;
  upgrade:any=2;
  purchase_packageid:any;
  purchase_packagerank:any;
  rank:any;
  constructor(public events: Events,private toast: ToastController,
    private storage: Storage,public http:HttpClient, public router: Router,
    private alertCtrl: AlertController,private apiservice: ApiService,
    private _gblSrc: GlobalVarService,) {
    this.count=1;
     this.storage.get('name').then((val)=>{
     let postData= new FormData(); 
     postData.append('user_id',val.id);
     this.userID=val.id;
     var API_URL='http://jigaju.esy.es/api/getsubscription_APP';
     let Data : Observable<any>;
         Data = this.http.post(API_URL,postData);
         Data.subscribe(data => {
           console.log(data.Balance); 
           if(data) 
           {
             this.content = data.All_Features;
             console.log(this.content); 
           }
         });
       });
     var API_URL='http://jigaju.esy.es/api/getAllPackageFeatures_APP';
     let responseData : Observable<any>;
         responseData = this.http.get(API_URL);
         responseData.subscribe(data => 
         {
             console.log(data);
             if(data)
             {  
               this.featureList = data.features;
               this.packageList = data.package;
               this.allPackageFeatures = data.feature_package;  
               let x=0;
 
               
                  for(let k=0 ;k<this.packageList.length ; k++)
                  {
 
                    if(this.packageList[k].package_name!="Free")
                    {
                     this.allPackageName[x++] = this.packageList[k];
                     
                    }
                    //console.log(this.allPackageName);
                  }
               for(let j=0;j<this.allPackageFeatures.length;j++)
               {
                 let tempPackageList:any;
                 let featurePackageList=[];
                 let featureCount=[];
                 let PackageList=[];
                 let packagematch:boolean=false;               
                 for(let i=0;i<this.packageList.length;i++)
                 {
 
                   PackageList=this.allPackageFeatures[j].Package_IDs.split(",");
                   packagematch=false;
                   for(let k=0;k<PackageList.length;k++)
                   {
                       if(PackageList[k]==this.packageList[i].id)
                       {
                         packagematch=true;                        
                         if(this.allPackageFeatures[j].Feature_Count.split(",")[k] == '-1')
                         {
                           featureCount.push('0');
                           featurePackageList.push('1');
                         }  
                         else
                         {                          
                           featureCount.push(this.allPackageFeatures[j].Feature_Count.split(",")[k]);
                           featurePackageList.push('2');
                         }  
                       }
                   }
                   if(!packagematch)
                   {
                     featurePackageList.push('0');
                     featureCount.push('0');
                   }
                 }
                 tempPackageList={'featureName':this.allPackageFeatures[j].Feature_name,'Counter':featureCount,'packageList':featurePackageList};
                 this.featurePackageMatrix.push(tempPackageList);
               }
               //console.log(this.featurePackageMatrix);
             }  
         });
   }
  ngOnInit() {
  }

  selectedPackage(period,packageid,validity,name,currency,rate,id,rank){
    //this.navCtrl.push(SubscriptionpurchasePage);
    let navigationExtras: NavigationExtras = {
         queryParams: {
           userID: JSON.stringify(this.userID)
         }
       };
    this.router.navigate(['subscriptionpurchase'],navigationExtras);

    //this.navCtrl.push(PurchasepackagePage,{packageName:packageName,currency:currency,rate:rate,period:period});
    /*this.period=period;
    this.packageid=packageid;
    this.validity=validity;
    this.name=name;
    this.currency=currency;
    this.rate=rate;
    this.buyinfo=true;
    this.id=id;
    this.count=1;
    this.rank=rank;
    document.getElementById("x").style.pointerEvents = "none";*/
   }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SubscriptionPage');
  }
  back(){
    this.buyinfo=false;
    document.getElementById("x").style.pointerEvents = "auto";

   }
   
  async buy(){
    for(let i=0;i<this.content.length;i++){      
      if(this.content[i].User_id!=null){
        this.purchase_packageid=this.content[i].id;
        this.purchase_packagerank=this.content[i].package_rank;
        if(this.purchase_packagerank<this.rank){        
            this.upgrade=1;
        }else{
          this.upgrade=0;
          let alert = await this.alertCtrl.create({
            header: '!!Downgrade!!',
            message: 'Downgrade is not available',
              cssClass: 'alertCustomCss',
            buttons: [					  
              {
              text: 'OK',
              handler: () => {
                this.buyinfo=false;
                document.getElementById("x").style.pointerEvents = "auto";
              }
              }
             ]					 
            });				
          await alert.present();
        }
      }
     }
     if(this.upgrade==1||this.upgrade==2){
        this.apiservice.buySubscription(this.userID,this.packageid,this.validity,this.period,this.count,"Subscription");
        document.getElementById("x").style.pointerEvents = "none";
        this.events.publish('userPurchase');
        let toaster =await this.toast.create({
          message: 'Subscription Purchased Successfully',
          duration: 3000
        });
        await toaster.present();
       // this.navCtrl.pop();
       this.router.navigate(["/"]);       
      }else{
        console.log('Downgrade is not available');
      }
  }

  return() {
    this.router.navigate(['/']);
  }

}
