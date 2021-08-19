import { Component } from '@angular/core';
import { AuthService } from "../services/auth.service";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { ViewChild, ViewChildren, QueryList, NgZone } from '@angular/core';
// import { NavController, } from '@ionic/angular';
//import { ProfilePage } from '../profile/profile';
import { Storage } from '@ionic/storage';
import { Device } from '@ionic-native/device';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AngularFireAuthModule } from "@angular/fire/auth";
import { ApiService } from "../services/api.service";
import { GlobalVarService } from "../services/global-var.service";
import { Events } from '../../app/services/events.service';
import { MenuController, AlertController } from '@ionic/angular';
// import { SplashPage } from '../splash/splash';
// import { SubscriptionpurchasePage } from '../subscriptionpurchase/subscriptionpurchase';
//import { InAppPurchase } from '@ionic-native/in-app-purchase/ngx';//import { RequestsProvider } from '../../providers/requests/requests';
// import { GlobalVariableProvider } from '../../providers/global-variable/global-variable';
import { InAppPurchase2, IAPProduct } from '@ionic-native/in-app-purchase-2/ngx';

// import 'rxjs/Rx';
import {
  StackConfig,
  ThrowEvent,
  Direction,
  SwingStackComponent,
  SwingCardComponent
} from 'angular2-swing';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild('myswing1') swingStack: SwingStackComponent;
  @ViewChildren('mycards1') swingCards: QueryList<SwingCardComponent>;

  slideOpts = {
    initialSlide: 1,
    speed: 400
  };


  stackConfig: StackConfig;
  rewardpointAwarded: string;
  pointreward: boolean = false;
  showAutoSwipe: boolean = false;
  rightSwipeBlock: boolean = false;
  userID: string;
  profileImage: string;
  content = [];
  name: string;
  logo: string;
  desc: string;
  rate: any;
  count: any;
  amount: any;
  period: any;
  packageid: any;
  validity: any;
  featuresid: any;
  buyinfo: boolean = false;
  showGallaryFlag: boolean = false;
  showGallary = [];
  showLoading: boolean = true;
  cardRewinded: boolean = false;
  boosterAvaliableTime: any;
  showBoosterTime: string;
  newUser: any;
  boostTime: boolean;
  consume: any;
  packageData = [];
  packageSelected = [];
  packageIndex: any = 0;
  buypackage: any;
  haspurchasedDiv: boolean;
  productid: any;
  mainMatchProfiles = [];
  udata: any = '';
  deviceToken = '';
  profileEmail:string;

  cards = [
        {
          img: "https://placeimg.com/300/300/people",
          title: "Demo card 1",
          description: "This is a demo for Tinder like swipe cards"
        },
        {
          img: "https://placeimg.com/300/300/animals",
          title: "Demo card 2",
          description: "This is a demo for Tinder like swipe cards"
        },
        {
          img: "https://placeimg.com/300/300/nature",
          title: "Demo card 3",
          description: "This is a demo for Tinder like swipe cards"
        },
        {
          img: "https://placeimg.com/300/300/tech",
          title: "Demo card 4",
          description: "This is a demo for Tinder like swipe cards"
        },
        {
          img: "https://placeimg.com/300/300/arch",
          title: "Demo card 5",
          description: "This is a demo for Tinder like swipe cards"
        }
      ]

  constructor(private auth: AuthService, private route: ActivatedRoute, private router: Router,
    public http: HttpClient,private menu: MenuController,private alertCtrl: AlertController,
    private store: InAppPurchase2,
    private storage: Storage, private apiservice: ApiService,
    private _authSrc: AuthService,
    public events:Events,
    private _gblSrc: GlobalVarService, private zone: NgZone) {
      this.count = 1;
    this.pointreward = false;
    this.newUser = _gblSrc.newUser;
    console.log(this.newUser);
    if (this._gblSrc.userId) {
      this.getUserInfo(this._gblSrc.userId);
    } else {
      this.storage.get('name').then(id => {
        this.userID = id.id;
        this.getUserInfo(this.userID);
      });
    }
    this.storage.get('token').then(token=>{
      this.deviceToken=token;
    });

    /*this.events.subscribe('ProfileImageChange', () => {
      this.zone.run(() => {
        this.profileImage = 'http://jigaju.esy.es/uploads/thumbnail/'+this._gblSrc.profileImage;
      });
    });*/

    this.stackConfig = {
      allowedDirections: [
        Direction.LEFT,
        Direction.DOWN,
        Direction.RIGHT,
        Direction.UP
      ],
      throwOutConfidence: (offsetX: number, offsetY: number, targetElement: HTMLElement) => {
        //console.log(offsetX+'  '+offsetY);
        //return 0;
        if ((offsetX > 50 && Math.abs(offsetY) > 50) || (Math.abs(offsetX) > 50 && Math.abs(offsetY) < 50) || offsetX < -100) {
          if (offsetX > 50 && offsetY < -100) { //---------- Super Like Start here -----------------------
            if (this.apiservice.checkUserFeature('21'))
              return 1;
            else
              this.checkout(12);
            this.showPurchaseDialog('12', '21');
          } else if (offsetX > 100) {  //-- right Swipe
            if (this.apiservice.checkUserFeature('8'))
              return 1;
            else
              this.rightSwipeBlock = true;
          }
          else if (offsetX > 50 && offsetY > 100) {  //--- right bottom Swipe
            return 1;
          }
          else if (offsetX < -50 && Math.abs(offsetY) < 135) {  //--- Left Swipe
            return 1;
          }
        }
      },
      transform: (targetElement, offsetX, offsetY, xConfidence) => {
        this.onItemMove(targetElement, offsetX, offsetY, (offsetX / targetElement.offsetWidth) * 20);
      },
      minThrowOutDistance: 900    // default value is 400
    };
    /*
    this.events.subscribe('datePreferenceChanged', () => {
      this.zone.run(() => {
        console.log('Reload Match....');
        this.loadMatchProfile(this.userID)
      });
    });

    this.events.subscribe('userPurchase', () => {
      this.zone.run(() => {
        console.log('Reload Features ....');
        this.apiservice.getUserEligibleFeatures_APP(this.userID);
      });
    });*/

  }

  ionViewWillEnter() {
    if (this._gblSrc.userId) {
      this.getUserInfo(this._gblSrc.userId);
    } else {
      this.storage.get('name').then(id => {
        this.userID = id.id;
        this.getUserInfo(this.userID);
      });
    }
  }

  getUserInfo(id) {
    this.userID = id;
    this.getuserdaat();
    this.loadMatchProfile(this.userID);
    this.apiservice.getUserEligibleFeatures_APP(this.userID);
    this.getUserBoosterTime(this.userID);
    console.log(this._gblSrc);
  }

  getuserdaat() {
    //this.UserDetail=val.id;            
    let postData = new FormData();
    var API_URL = 'http://jigaju.esy.es/api/getuserdetails';
    postData.append('userid', this.userID);
    let responseData: Observable<any>;
    responseData = this.http.post(API_URL, postData);
    responseData.subscribe(data => {
      console.log(data);
      if (!data.error) {
        var items = data.body[0];
        this.udata = data.body[0];
        this.profileEmail=data.body[0].email;
        //this.profileInfo=this.items.fname;
        //this.profileEmail=this.items.email;
        //this.img_profile = 'http://jigaju.esy.es/uploads/thumbnail/'+this.items.profile_image;
        this._gblSrc.currectUserAllDetails = items;
        this.profileImage = 'http://jigaju.esy.es/uploads/thumbnail/' + this._gblSrc.currectUserAllDetails.profile_image;




        // this.items=data.body[0];
        // this.profileInfo=this.items.fname;
        // this.profileEmail=this.items.email;
        // this.img_profile = 'http://jigaju.esy.es/uploads/thumbnail/'+this.items.profile_image;
        // globalVariableProvider.currectUserAllDetails=this.items;




        //if(this.navParams.get('newUser'))
        //  globalVariableProvider.newUser=true;
        // this.Mainpage = HomePage;
      }
      else {
        console.log('Unable to fetch info for userid (' + this.userID + ') ' + data.message);
        // this.Mainpage = SplashPage;
      }
    }, onerror => {
      console.log(JSON.stringify(onerror.message) + 'Unable to fetch info for userid ' + this.userID);
      //this.Mainpage = SplashPage;
    });
  }

  ngAfterViewInit() {
    this.swingCards.forEach((c) => console.log(c.getCard()));
    /*$(document).ready(function() {
      var animateButton = function(e) {

        e.preventDefault;
        //reset animation
        e.target.classList.remove('animate');

        e.target.classList.add('animate');
        setTimeout(function(){
          e.target.classList.remove('animate');
        },700);
      };

      document.getElementById("superLikeButton").addEventListener('click', animateButton, false);
    });*/
  }

  // Called whenever we drag an element
  onItemMove(element, x, y, r) {
    //var abs = Math.abs(x);
    element.style['transform'] = `translate3d(0, 0, 0) translate(${x}px, ${y}px) rotate(${r}deg)`;
  }

  // Connected through HTML
  voteUp(like: boolean, point, featureid) {

    let postData = new FormData();
    let responseData: Observable<any>;
    let API_URL: string;

    if (featureid === 21 && this.content.length > 0) {
      this.checkout(12);
      //---------- Super Like Start here -----------------------
      if (this.apiservice.checkUserFeature(featureid)) {
        this.swipeAction(point, featureid, this.apiservice.consumeFromPackage, 'superLike');
      }
      else {
        this.showPurchaseDialog('12', '21');
      }
    } else {
      if (this.content.length > 0) {
        if (like) {  //-----------------  Right Swipe or Like ------------------
          if (this.apiservice.checkUserFeature('8'))
            this.swipeAction(point, featureid, this.apiservice.consumeFromPackage, 'RightSwipe');
          else
            this.rightSwipeBlock = true;
        } else {  //-----------------  left Swipe or Like ------------------
          postData = new FormData();
          let removedCard = this.content[this.content.length - 1];
          postData.append('user_id', this.userID);
          postData.append('friend_id', removedCard.id);
          API_URL = 'http://jigaju.esy.es/api/friend_dislike_APP';
          responseData = this.http.post(API_URL, postData);
          responseData.subscribe(data => {
            this.content.pop();
            if (this.mainMatchProfiles.length > 0)
              this.content.push(this.mainMatchProfiles.shift());
            console.log(this.mainMatchProfiles);
            console.log(this.content);
            if (this.content.length === 0)
              this.showAutoSwipe = false;
            else
              this.showAutoSwipe = true;
          }, onerror => {
            console.log('Network Or Server Error While Adding Friend');
            this.rewardpointAwarded = '';
          });
        }
      }
    }
  }

  swipeAction(point: string, featureid: string, packageid: string, swipeAction: string) {
    if (swipeAction == 'superLike' || this.apiservice.consumeRightSwipeFeature(featureid)) {
      this.apiservice.consumeFeature(this.userID, featureid, packageid).subscribe(data => {
        console.log(data);
        this.apiservice.getUserEligibleFeatures_APP(this.userID);
      }), onerror => {
        console.log('Error While calling consume feature ' + onerror.message);
      };
    } else {
      this.apiservice.consumeFreeRightSwipe(this.userID, featureid).subscribe(data => {
        console.log(data);
        this.apiservice.getUserEligibleFeatures_APP(this.userID);
      }), onerror => {
        console.log('Error While calling consume feature ' + onerror.message);
      };
    }
    if (this.content.length > 0) {
      this.pointreward = true;
      this.rewardpointAwarded = '+' + point
    }
    let removedCard = this.content[this.content.length - 1];
    let postData = new FormData();
    postData.append('user_id', this.userID);
    postData.append('friend_id', removedCard.id);
    postData.append('rating', point);
    console.log('like ' + removedCard.id + '   ' + this.userID);
    this.http.post('http://jigaju.esy.es/api/friend_like_APP', postData).subscribe(data => {
      console.log(data);
      console.log(removedCard.ejuser + '  ' + this._gblSrc.currectUserAllDetails.ejuser);
      this.apiservice.sendrequest(removedCard.ejuser, this._gblSrc.currectUserAllDetails.ejuser);
    }, onerror => {
      console.log('Network Or Server Error While Adding Friend ' + onerror.message);
    });

    setTimeout(() => {
      this.pointreward = false;
      this.content.pop();
      if (this.content.length === 0)
        this.showAutoSwipe = false;
      else
        this.showAutoSwipe = true;
    }, 1500);
    document.getElementById("x").style.pointerEvents = "auto";
  }

  onThrowOut(event: ThrowEvent) {
    console.log('Hook from the template', event.throwDirection);
  }

  profile(userID) {
    // this.navCtrl.push(ProfilePage,{id:userID});
    let navigationExtras: NavigationExtras = {
      queryParams: {
        id: userID
      }
    };
    this.router.navigate(['profile'], navigationExtras);
  }

  loadMatchProfile(id: string) {
    let postData = new FormData();
    var API_URL = 'http://jigaju.esy.es/api/search_match_APP';
    postData.append('id', this.userID);
    let responseData: Observable<any>;
    setTimeout(() => {
      this.showLoading = false;
      if (this.content.length > 0)
        this.showAutoSwipe = true;
    }, 2000);
    responseData = this.http.post(API_URL, postData);
    responseData.subscribe(data => {
      this.mainMatchProfiles = data.content;
      if (this.mainMatchProfiles.length > 1) {
        this.content.push(this.mainMatchProfiles.shift());
        this.content.push(this.mainMatchProfiles.shift());
      } else if (this.mainMatchProfiles.length > 0 && this.mainMatchProfiles.length < 2) {
        this.content.push(this.mainMatchProfiles.shift());
      }
      console.log(this.mainMatchProfiles);
      console.log(this.content);
      if (!data) {
        console.log('No Match Found');
        //this.navCtrl.push(SplashPage);
        this.router.navigate(['SplashPage']);
      }
    }, onerror => {
      console.log('Network Or Server Error, Unable to Login' + JSON.stringify(onerror));
      //this.navCtrl.push(SplashPage);
      this.router.navigate(['SplashPage']);
    });
  }

  wishlist(id: string) {
    event.stopPropagation();
    let selectedId = "addwishlist_" + id;
    document.getElementById(selectedId).style.color = "#fe2829";
    setTimeout(() => {
      let postData = new FormData();
      let responseData: Observable<any>;
      let API_URL: string;
      postData.append('user_id', this.userID);
      postData.append('friend_id', id);
      API_URL = 'http://jigaju.esy.es/api/friend_wishlist';
      responseData = this.http.post(API_URL, postData);
      responseData.subscribe(data => {
        //console.log(data);

        this.content.pop();
        if (this.content.length === 0)
          this.showAutoSwipe = false;
        else
          this.showAutoSwipe = true;
      }, onerror => {
        console.log('Network Or Server Error While Adding Friend');
      });
    }, 500);
  }

  rewind() {
    if (this.apiservice.checkUserFeature('11')) {
      this.apiservice.consumeFeature(this.userID, '11', this.apiservice.consumeFromPackage).subscribe(data => {
        this.apiservice.getUserEligibleFeatures_APP(this.userID);
        console.log(data);
        let postData = new FormData();
        let responseData: Observable<any>;
        let API_URL: string;
        postData.append('id', this.userID);
        API_URL = 'http://jigaju.esy.es/api/friend_Undo_APP';
        responseData = this.http.post(API_URL, postData);
        responseData.subscribe(data => {
          console.log(data);
          if (data.content.length > 0) {
            this.content.push(data.content[0]);
            this.cardRewinded = true;
            setTimeout(() => {
              this.cardRewinded = false;
            }, 500);
          }

          if (this.content.length > 0)
            this.showAutoSwipe = true;
          else
            this.showAutoSwipe = false;
        }, onerror => {
          console.log('Network Or Server Error While Adding Friend');
        });
      });
    } else {
      console.log('Feature not available');
      // this.navCtrl.push(SubscriptionpurchasePage);
      let navigationExtras: NavigationExtras = {
        queryParams: {
          userID: JSON.stringify(this.userID)
        }
      };
      this.router.navigate(['subscriptionpurchase'], navigationExtras);
    }
  }

  autoswipe(point, count, featureid) {
    this.checkout(6);
    if (this.apiservice.checkUserFeature(featureid)) {
      this.pointreward = true;
      this.rewardpointAwarded = 'Auto Like' + count + 'Profiles';
      this.apiservice.consumeFeature(this.userID, featureid, this.apiservice.consumeFromPackage).subscribe(data => {
        this.apiservice.getUserEligibleFeatures_APP(this.userID);
        console.log(data);
      });
      this.rewardpointAwarded = point + ' Points Rewards To Match';
      for (let i = 0; i < count; i++) {
        let removedCard = this.content.pop();
        if (this.content.length === 0)
          this.showAutoSwipe = false;
        else
          this.showAutoSwipe = true;
        if (removedCard) {
          let postData = new FormData();
          let responseData: Observable<any>;
          let API_URL: string;
          postData.append('user_id', this.userID);
          postData.append('friend_id', removedCard.id);
          postData.append('rating', point);
          console.log('like ' + removedCard.id + '   ' + this.userID);
          API_URL = 'http://jigaju.esy.es/api/friend_like_APP';
          responseData = this.http.post(API_URL, postData);
          responseData.subscribe(data => {
            console.log(data);
            if (data) {
              this.content.pop();
              //this.rewardpointAwarded='';
            }
          }, onerror => {
            console.log('Network Or Server Error While Adding Friend');
            this.rewardpointAwarded = '';
          });
        } else break;

      }
      document.getElementById("x").style.pointerEvents = "auto";

    } else {
      this.showPurchaseDialog('6', '17');
    }
    setTimeout(() => {
      this.pointreward = false;
    }, 5000);
  }

  userBoost(featureid) {
    this.checkout(13);
    if (this.apiservice.checkUserFeature(featureid)) {
      this.pointreward = true;
      this.rewardpointAwarded = 'your profile boosted for 30 min';
      this.apiservice.consumeFeature(this.userID, featureid, this.apiservice.consumeFromPackage).subscribe(data => {
        this.apiservice.getUserEligibleFeatures_APP(this.userID);
        this.getUserBoosterTime(this.userID);
      });
      document.getElementById("x").style.pointerEvents = "auto";
    } else {
      this.showPurchaseDialog('13', '10');
    }
    setTimeout(() => {
      this.pointreward = false;
    }, 5000);
  }
  back() {
    this.buyinfo = false;
    document.getElementById("x").style.pointerEvents = "auto";
  }

  buy() {
    document.getElementById("x").style.pointerEvents = "auto";
    var validity: any = this.validity * this.count;
    this._gblSrc.IAPPackageID = this.packageid;
    this._gblSrc.IAPPackageValidity = validity;
    this._gblSrc.IAPUserID = this.userID;
    this._gblSrc.IAPPackagePeriod = this.period;
    this._gblSrc.IAPPackagecount = this.count;
    this._gblSrc.packageType = "Addon";
    this.store.order(this.productid).
      then(data => {
        console.log('Purchase success ' + JSON.stringify(data))
        this.buyinfo = false;
        this.apiservice.getUserEligibleFeatures_APP(this.userID);

      },
        onerror => { console.log('Unbale to purchase ' + JSON.stringify(onerror.message)) });
  }

  showUserGallary(data: any) {
    this.showGallary = data.split(',');
    this.showGallaryFlag = true;
  }
  closeGalary() {
    this.showGallaryFlag = false;
  }

  showPurchaseDialog(packageid: string, featureid: string) {
    let postData = new FormData();
    let responseData: Observable<any>;
    let API_URL: string;
    postData.append('packageid', packageid);
    API_URL = 'http://jigaju.esy.es/api/featuredetails_APP';
    responseData = this.http.post(API_URL, postData);
    responseData.subscribe(data => {
      //console.log(data);
      this.name = data.package_name;
      this.logo = data.Package_Logo;
      this.desc = data.Package_Desc;
      this.rate = data.rate;
      this.packageid = packageid;
      this.featuresid = featureid;
      this.buyinfo = true;
      this.amount = this.rate;
      document.getElementById("x").style.pointerEvents = "none";
    });
  }

  upgrade() {
    this.rightSwipeBlock = false;
    // this.navCtrl.push(SubscriptionpurchasePage);
    this.router.navigate(['subscriptionpurchase']);
  }

  CloseRightSwipPopup() {
    this.rightSwipeBlock = false;
  }

  gotit() {
    this.newUser = false;
    this._gblSrc.newUser = false;
  }

  settimer() {
    this.boostTime = true;
    //while(this.boosterAvaliableTime>0)
    // {
    let timer = setInterval(() => {
      if (this.boosterAvaliableTime > 0) {
        this.boosterAvaliableTime -= 1;
        var boostRemainMinutes = Math.floor(this.boosterAvaliableTime / 60);
        var boostRemainSeconds = this.boosterAvaliableTime - boostRemainMinutes * 60;
        if (boostRemainMinutes <= 9)
          this.showBoosterTime = '0' + boostRemainMinutes + ':';
        else
          this.showBoosterTime = boostRemainMinutes + ':';
        if (boostRemainSeconds <= 9)
          this.showBoosterTime = this.showBoosterTime + '0' + boostRemainSeconds;
        else
          this.showBoosterTime = this.showBoosterTime + boostRemainSeconds;

      }
      if (this.boosterAvaliableTime < 1) {
        this.boostTime = false;
        clearInterval(timer);
        //return;
      }
    }, 1000);
  }

  getUserBoosterTime(userID: string) {
    let postData = new FormData();
    let responseData: Observable<any>;
    let API_URL: string;
    postData.append('featureid', '10');
    postData.append('userid', userID);
    API_URL = 'http://jigaju.esy.es/api/getboostTime_APP';
    responseData = this.http.post(API_URL, postData);
    responseData.subscribe(data => {
      //console.log(data);
      if (data && data.length > 0) {
        this.boosterAvaliableTime = 1800 - data[0].Booset_time_remain;
        this.settimer();
        console.log(this.boosterAvaliableTime);
      }
      else
        this.boosterAvaliableTime = null;
    });
  }

  SelectPackage(packageData, i) {
    this.buypackage = [];
    this.buypackage = packageData;
    this.packageIndex = i;
    this.packageSelected = this.packageData[this.packageIndex];
    this.count = packageData[i].pack;
  }

  checkout(packageid) {
    let postData = new FormData();
    postData.append('packageid', packageid);
    var API_URL = 'http://jigaju.esy.es/api/getFeaturepackage_APP';
    let responseData: Observable<any>;
    responseData = this.http.post(API_URL, postData);
    responseData.subscribe(data => {
      console.log(data);
      this.packageData = data;
      this.packageSelected = this.packageData[this.packageIndex];
      this.productid = this.packageData[this.packageIndex].Product_ID;
      this.count = this.packageData[this.packageIndex].pack;
    });

  }
  messageRecived() {
     this.events.publish('is_read');
  }

  async Logout() {
    this.presentConfirm();
    
  }

  async presentConfirm() {
     let alert =await this.alertCtrl.create({
        //title: 'Confirm Logout',
        message: 'Do you want to Logout ?',
        cssClass: 'alertCustomCss',
        buttons: [
          {
            text: 'NO',
            role: 'cancel',
            handler: () => {
              console.log('NO');
            }
          },
          {
            text: 'YES',
            handler:async () => {
                  //console.log('YES'); 
                  let postData= new FormData();
                  var API_URL='http://jigaju.esy.es/api/logout_APP';
                  postData.append('id',this.userID);
                  if(this.deviceToken)
                    postData.append('device_token',this.deviceToken); 
                  else
                    postData.append('device_token',this.profileEmail+'_Browser');
                  
                  let responseData : Observable<any>;
                  responseData = this.http.post(API_URL,postData);
                  responseData.subscribe(async data => {
                    //this.userProvider.logout();
                    console.log(data);    
                    await this.auth.logout();
                    
                  });
                this.storage.remove('name');
               // this.platform.exitApp();
                this.router.navigate(["splash"]);       
               }
          }
         ]
        });
    await alert.present();
  }

  goto(link) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        userID: JSON.stringify(this.userID)
      }
    };
    if(!this.userID) {
      this.router.navigate(['splash']);
    }
    if (link === 'mappoint') {
      this.router.navigate(["mappoint"], navigationExtras);
    } else if (link === 'match') {
     // this.router.navigate(["match"], navigationExtras);
     // this.router.navigate(["sidemenu"]);
     this.menu.close();
    } else if (link === 'chat') {
      this.router.navigate(["chat"], navigationExtras);
    } else if (link === 'subscription') {
      this.router.navigate(["subscription"], navigationExtras);
    } else if (link === 'matchcheckout') {
      this.router.navigate(["matchcheckout"], navigationExtras);
    } else if (link === 'myprofile') {
      this.router.navigate(["setting"], navigationExtras);
    } else if (link === 'userranking') {
      this.router.navigate(["userranking"], navigationExtras);
    } else if (link === 'fprofile') {
      this.router.navigate(["featureduser"], navigationExtras);
    } else if (link === 'blockuser') {
      this.router.navigate(["blockuser"], navigationExtras);
    } else if (link == 'insight') {
      this.router.navigate(["insight"], navigationExtras);
    } else if (link == 'subscriptionpurchase') {
      this.router.navigate(['features'], navigationExtras);
    } else if (link == 'setting') {
      this.router.navigate(['setting'], navigationExtras);
    } else if (link == 'editprofile') {
      this.router.navigate(['editprofile'], navigationExtras);
    }


  }
}

