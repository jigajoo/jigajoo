import { Component, OnInit } from '@angular/core';
import { AlertController  } from '@ionic/angular';
import { Router,ActivatedRoute } from "@angular/router";
import { Events } from '../../app/services/events.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { RequestsProvider } from '../../providers/requests/requests';
import { InAppPurchase2 } from '@ionic-native/in-app-purchase-2/ngx';
import { GlobalVarService } from "../services/global-var.service";
import { ApiService } from "../services/api.service";

@Component({
  selector: 'app-features',
  templateUrl: './features.page.html',
  styleUrls: ['./features.page.scss'],
})
export class FeaturesPage implements OnInit {

  content=[];
  userFeatures=[];
  userID:string;
  subscriptionid=[];
  info:boolean=false;
  Logo:any;
  Purchased_count:any;
  Consumed_Count:any;
  consumed:any;
  percentuse:any;
  featurenotuse:number;
  height:any;
  buyinfo:boolean=false;
  name:string;
logo:string;
desc:string;
rate:any;
count:any;
amount:any;
period:any;
packageid:any;
validity:any;
featuresid:any;
haspurchasedDiv:boolean;
consume:any;
packageData=[];
packageSelected=[];
packageIndex:any=0;
buypackage:any;
Balance:any;
userPackageId:any;
productid:any;
constructor(public events: Events,private _gblSrc: GlobalVarService,private store: InAppPurchase2, 
  private apiservice: ApiService,public http:HttpClient,public router: Router, 
   private route: ActivatedRoute, public alertController: AlertController) {
  // this.userID=navParams.get('id');
  this.route.queryParams.subscribe(params => {
    if (params && params.userID) {
      this.userID = JSON.parse(params.userID);
      let postData= new FormData(); 
      postData.append('user_id',this.userID);
      var API_URL='http://jigaju.esy.es/api/getaddonFeatures_APP';
      let responseData : Observable<any>;
          responseData = this.http.post(API_URL,postData);
          responseData.subscribe(data => {
            if(data) 
            {
              this.content = data.All_Features;
              console.log(this.content);
            }
          }); 
    }
  });
  

    }

  ngOnInit() {
  }

  backpage() {
    this.router.navigate(['/'])
  }

  checkout(logo,name,desc,rate,id,period,packageid,validity,featuresid,purchasedDiv,userPackageId,Balance){
    this.name=name;
    this.logo=logo;
    this.desc=desc;
    this.rate=rate;
    this.subscriptionid=id;
    this.packageid=packageid;
    this.period=period;
    this.validity=validity;
    this.featuresid=featuresid;
    this.buyinfo=true;
    this.amount=this.rate;
    this.userPackageId=userPackageId;
    this.Balance=Balance;
    this.haspurchasedDiv=purchasedDiv;
    let postData= new FormData(); 
    postData.append('packageid',packageid);    
    var API_URL='http://jigaju.esy.es/api/getFeaturepackage_APP';
    let responseData : Observable<any>;
        responseData = this.http.post(API_URL,postData);
        responseData.subscribe(data => {
          console.log(data);
          this.packageData=data;
          this.packageSelected=this.packageData[this.packageIndex];
          this.productid=this.packageData[this.packageIndex].Product_ID;
          this.count=this.packageData[this.packageIndex].pack;
          console.log(this.productid);
        });
   }

   use(logo,packageid,featureid){
    this.buyinfo =true;
     this.info=true;
     this.Logo=logo;
     let postData= new FormData(); 
     postData.append('userid',this.userID);
     postData.append('packageid',packageid);
     postData.append('featureid',featureid);     
     var API_URL='http://jigaju.esy.es/api/getFeaturesuse_APP';
     let responseData : Observable<any>;
         responseData = this.http.post(API_URL,postData);
         responseData.subscribe(data => {
           console.log(data);
        //this.Purchased_count=data[0].Purchased_count;
        //this.Consumed_Count=data[0].Consumed_Count;
          this.consumed= this.Consumed_Count/this.Purchased_count;
          this.percentuse=this.consumed*100;
          this.height=this.percentuse+'%';
          this.featurenotuse=100-this.percentuse;
          console.log(this.featurenotuse); 
          if(this.featurenotuse>70){
            document.getElementById("myDiv").classList.add("green");
           }else if(this.featurenotuse>30){
            document.getElementById("myDiv").classList.add("blue");
           }else if(this.featurenotuse<30){
            document.getElementById("myDiv").classList.add("red");
           }
           document.getElementById('chartdiv').style.height =   this.height;
         }); 
         
   }
   back(){
    this.info=false;
    this.buyinfo=false;

   }
  
  buy(){
    var validity:any=this.validity*this.count;
    this._gblSrc.IAPPackageID=this.packageid;
    this._gblSrc.IAPPackageValidity=validity;
    this._gblSrc.IAPUserID=this.userID;
    this._gblSrc.IAPPackagePeriod=this.period;
    this._gblSrc.IAPPackagecount=this.count;
    this._gblSrc.packageType="Addon";
    this.store.order(this.productid).
    then(data=>{console.log('Purchase success '+JSON.stringify(data))},
      onerror=>{console.log('Unbale to purchase '+JSON.stringify(onerror.message))});  
    //this.requestsProvider.buySubscription(this.userID,this.packageid,validity,this.period);
    this.buyinfo=false;
    this.events.publish('userPurchase');
    this.router.navigate(['/']);
    //this.navCtrl.pop();
    
     
  }
  SelectPackage(packageData,i){
  this.buypackage=[];
  this.buypackage=packageData;
  this.packageIndex=i;
  this.packageSelected=this.packageData[this.packageIndex];
  this.count=packageData[i].pack;
  console.log(this.count);
  }
  buymore(){
    this._gblSrc.flag=1;
     var validity:any=this.validity*this.count;
     this.store.order(this.productid).
     then(data=>{console.log('Purchase success '+JSON.stringify(data))  
    let postData= new FormData(); 
    postData.append('userid',this.userID);
    postData.append('userpackageid',this.userPackageId);
    postData.append('balance',this.Balance); 
    postData.append('subscriptionid', this.packageid);
    postData.append('validity',validity);
    postData.append('period',this.period);   
    postData.append('count',this.count);   
    postData.append('packageType','Addon');   
    var API_URL='http://jigaju.esy.es/api/buymorefeature_APP';
    let responseData : Observable<any>;
        responseData = this.http.post(API_URL,postData);
        responseData.subscribe(data => {
          console.log(data);
          this._gblSrc.flag=0;
     this.buyinfo=false;
     this.events.publish('userPurchase');
     //this.navCtrl.pop();
     this.router.navigate(['/'])

        });
      },
      onerror=>{console.log('Unbale to purchase '+JSON.stringify(onerror.message))});
   }

}
