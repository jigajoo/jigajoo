import { Component, OnInit } from '@angular/core';
 import { LoadingController, ToastController,Platform } from "@ionic/angular";

import { Router, ActivatedRoute } from "@angular/router";
// import { Events } from '../services/events.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage'; 
import { InAppPurchase2 ,IAPProduct } from '@ionic-native/in-app-purchase-2/ngx';
import { InAppPurchase } from '@ionic-native/in-app-purchase/ngx';
import { ApiService } from "../services/api.service";
import { GlobalVarService } from "../services/global-var.service";

@Component({
  selector: 'app-subscriptionpurchase',
  templateUrl: './subscriptionpurchase.page.html',
  styleUrls: ['./subscriptionpurchase.page.scss'],
})
export class SubscriptionpurchasePage implements OnInit {

  content=[];
  count:any;
  userID:any;
  features=[];
  fraturesname=[];
  displayname=[];
  test:any;
  img1=[];
  img2=[];
  packageSelected:any;
  selectedPackageScheme:string;
  packageIndex:number=0;
  schemeIndex:number=0;
  showPurchaseDialog:boolean=false;
  productIds = ['goldmonth','ptmonthly']; // <- Add your product Ids here
  products: any;
  sid= 'goldmonth';

  constructor(public platform: Platform,private storage: Storage,
    private apiservice: ApiService,
    private _gblSrc: GlobalVarService,
    private store : InAppPurchase2, 
    private route: ActivatedRoute,public http:HttpClient, public router: Router,private iap: InAppPurchase) {
    this.count=1;
     this.route.queryParams.subscribe(params => {
               if (params && params.userID) {
                 this.userID = JSON.parse(params.userID);
               }
            //this.userID=val.id;
           let postData= new FormData(); 
           postData.append('user_id',this.userID);
           var API_URL='http://jigaju.esy.es/api/getsubscription_APP';
           let Data : Observable<any>;
               Data = this.http.post(API_URL,postData);
               Data.subscribe(data => {
                 console.log(data);
                 this.platform.ready().then(async () => {
                   await this.registerProducts(data.All_Features);
                   await this.setupListeners();
                 });
                 if(data) 
                 {
                   this.content = data.All_Features;
                   this.test=this.content[this.packageIndex].package_name; 
                   this.packageSelected=this.content[this.packageIndex];
                   this.selectedPackageScheme=this.content[this.packageIndex].Product_Title.split(',')[this.schemeIndex];
                 }
                 
               });
       });
    
         var API_URL='http://jigaju.esy.es/api/getfeaturesByPackageid_APP';
         let Data : Observable<any>;
             Data = this.http.get(API_URL);
             Data.subscribe(data => {
               //console.log(data);
               if(data) 
               {
                this.features=data;
                for(let i=0;i<this.features.length;i++){
                  this.fraturesname[this.features[i].package_name]=this.features[i].Feature_name.split(",");
                  this.img1[i]=this.features[i].Feature_img.split(",");
                }
                this.img2=this.img1[1];
                this.displayname=data[1].Feature_name.split(",");
               }
             });
             //this.events.subscribe('userPurchase', () => {
         //     this.navCtrl.pop();
            // this.router.navigate(["/"]);

             //});
   }

  ngOnInit() {
    this.checkProducts();
  }

  registerProducts(data) {
    console.log("99",data);
    var pi =[];
    for(let i=0; i< data.length; i++){
      const ids = data[i].Product_ID.split(',');
      console.log(ids);
      pi = pi.concat(ids);
      console.log(pi);

    }
    for(let j=0; j< pi.length; j++){
        this.store.register({
          id: pi[j],
          type: this.store.PAID_SUBSCRIPTION//this.store.NON_RENEWING_SUBSCRIPTION,
        });
    }
    this.store.register({
      id: this.sid,
      type: this.store.PAID_SUBSCRIPTION//this.store.NON_RENEWING_SUBSCRIPTION,
    });
    this.store.register({
      id: "ptmonthly",
      type: this.store.PAID_SUBSCRIPTION//this.store.NON_RENEWING_SUBSCRIPTION,
    });
 
    /*this.store.register({
      id: PRODUCT_PRO_KEY,
      type: this.store.NON_CONSUMABLE,
    });*/
 
    this.store.refresh();
  }

  setupListeners() {
      // General query to all products
      this.store.when('product')
        .approved((p: IAPProduct) => {
          // Handle the product deliverable
          console.log("10444444444444444444444",JSON.stringify(p));
          if (p.id === 'ptmonthly') {
            //this.isPro = true;
          } else if (p.id === this.sid) {
            // this.gems += 100;
          }
          // this.ref.detectChanges();
   
          return p.verify();
        })
        .verified((p: IAPProduct) => p.finish());
      // Specific query for one ID
      // this.store.when(PRODUCT_PRO_KEY).owned((p: IAPProduct) => {
       // this.isPro = true;
      //});
    }

  /*regplatinum(){
    this.platform.ready().then(() => {
         this.store.register({
           id: 'ptmonthly',
           type: this.store.PAID_SUBSCRIPTION//this.store.NON_RENEWING_SUBSCRIPTION,
         });
         this.store.when('ptmonthly')
           .approved(p => {
               console.log("102",JSON.stringify(p));
                        p.verify();
                          })
           .verified(p =>{ 
            console.log("106",JSON.stringify(p));
            p.finish();});
         this.store.refresh();
         //console.log("this.store.products111111111111111",JSON.stringify(this.store.products));
        });
      this.store.when('ptmonthly').registered( (product: IAPProduct) => {
              console.log('Registered: ' + JSON.stringify(product));
             // this.store.refresh();
         console.log("this.store.114",JSON.stringify(this.store.products));
      });
      this.store.when('ptmonthly').updated( (product: IAPProduct) => {
        console.log('Updated116' + JSON.stringify(product));
        console.log('Updatedow118' + JSON.stringify(product.owned));
      });
  }*/

  async checkProducts() {
      console.log("9555555555555");

      this.platform.ready().then(async () => {
        //await this.registerProducts();
        //await this.setupListeners();
        /* this.store.register({
           id: this.sid,
           type: this.store.PAID_SUBSCRIPTION//this.store.NON_RENEWING_SUBSCRIPTION,
         });
         this.store.when(this.sid)
           .approved(p => {
               console.log("10444444444444444444444",JSON.stringify(p));
                        p.verify();
                          })
           .verified(p =>{ 
            console.log("108888888888888888888888888",JSON.stringify(p));
            p.finish();});
         this.store.refresh();
         console.log("this.store.products111111111111111",JSON.stringify(this.store.products));*/
        });

      this.store.when(this.sid).registered( (product: IAPProduct) => {
              console.log('Registered: ' + JSON.stringify(product));
             // this.store.refresh();
         console.log("this.store.products111111111111111",JSON.stringify(this.store.products));
      });
      this.store.when("ptmonthly").registered( (product: IAPProduct) => {
              console.log('Registered ptmonthly: ' + JSON.stringify(product));
             // this.store.refresh();
         console.log("this.store.products111111111111111",JSON.stringify(this.store.products));
      });
      this.store.when(this.sid).updated( (product: IAPProduct) => {
        console.log('Updated' + JSON.stringify(product));
        console.log('Updatedow' + JSON.stringify(product.owned));
      });

      this.store.when(this.sid).owned( (product: any) => {
        console.log('ownedowned11' + JSON.stringify(product));
      });


      // User closed the native purchase dialog
      this.store.when(this.sid).cancelled( (product) => {
          console.error('Purchase was Cancelled');
      });

      // Track all store errors
      this.store.error( (err) => {
        console.error('Store Error ' + JSON.stringify(err));
      });

      // Run some code only when the store is ready to be used
      this.store.ready(() =>  {
        console.log('Store is ready');
        console.log('Products: ' + JSON.stringify(this.store.products));
        console.log(JSON.stringify(this.store.get(this.sid)));
      });

      /*this.iap
        .getProducts(this.productIds)
        .then((products) => {
          console.log("productttttttttttttttttttttttttttttttttttt",JSON.stringify(products));
          this.products = products
          //  [{ productId: 'com.yourapp.prod1', 'title': '...', description: '...', price: '...' }, ...]
        })
        .catch((err) => {
          console.log('errrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr',JSON.stringify(err));
        });*/
    }

  back(){
  //  this.navCtrl.pop();
    this.router.navigate(["/"]);
  }
  package(packagename,i){
    this.displayname=[];
    this.img2=[];
    this.displayname=this.fraturesname[packagename.package_name];
    this.test=packagename.package_name;
    this.img2=this.img1[i];
    this.packageSelected=packagename;
    //console.log(this.packageSelected);
  }

  SelectPackage(selectedPackage:any,index:number)
  {
      console.log(selectedPackage);
    this.selectedPackageScheme= selectedPackage.Product_Title.split(',')[index];
    this.schemeIndex=index; 
    console.log(selectedPackage);
  }
  
  PurchaseDialog()
  {
    this.showPurchaseDialog=true;
  }
  
  cancelBuy()
  {
    //this.navCtrl.pop();
    this.router.navigate(["/"]);

  }

  restorePurchase() {
    this.iap
      .restorePurchases()
      .then((data) => {
        console.log(data);
        alert('Purchase was successful!');
      })
      .catch((err) => {
        console.log(err);
        alert('Something went wrong');
      });
  }

  BuySubscription()
  {
    let validity=this.packageSelected.validity*this.packageSelected.Product_Pack.split(',')[this.schemeIndex];
    console.log('Product ID Selected For Purchase: '+this.packageSelected.Product_ID.split(',')[this.schemeIndex] + ' Product Validity '+validity);
    this._gblSrc.IAPPackageID=this.packageSelected.id;
    this._gblSrc.IAPPackageValidity=validity;
    this._gblSrc.IAPUserID=this.userID;
    this._gblSrc.IAPPackagePeriod=this.packageSelected.period;
    this._gblSrc.packageType="Subscription";
    console.log(this.packageSelected.Product_ID.split(',')[this.schemeIndex]);
    //console.log(this.store);
    //console.log(this.store.products);
    //this.store.verbosity = this.store.DEBUG;
    console.log(this.sid);
    // this.store.order(this.sid);
    console.log(this.store);

    console.log(this.store.products);
    if(this.packageSelected.Product_ID.split(',')[this.schemeIndex] === '14'){
      this.store.order("goldmonth").
      then(data=>{console.log('Purchase success '+JSON.stringify(data))},
        onerror=>{console.log('Unbale to purchase '+JSON.stringify(onerror.message))});
    }else{
      // this.regplatinum();
      this.store.order("ptmonthly").
      then(data=>{console.log('Purchase success '+JSON.stringify(data))},
        onerror=>{console.log('Unbale to purchase '+JSON.stringify(onerror.message))});
    }
    
    /*this.iap
          .buy("goldmonth")
          .then((data) => {
            this.store.order(this.sid);
            console.log("data",JSON.stringify(data));
            alert('Purchase was successful!');
          })
          .catch((err) => {
            console.log(err,JSON.stringify(err));
            alert('Something went wrong');
          });
   
     

    /*this.store.order(this.packageSelected.Product_ID.split(',')[this.schemeIndex]).
    then(data=>{console.log('Purchase success '+JSON.stringify(data))},
      onerror=>{console.log('Unbale to purchase '+JSON.stringify(onerror.message))});   */
    // this.apiservice.buySubscription(this.userID,this.packageSelected.id,validity,this.packageSelected.period,'','');
  }

}
