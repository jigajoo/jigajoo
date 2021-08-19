import { OnInit } from '@angular/core';
import { Component, NgZone } from '@angular/core';
import { AlertController,LoadingController,ToastController, ModalController } from '@ionic/angular';
import { Events } from '../../app/services/events.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Injectable } from '@angular/core';
import { Router,ActivatedRoute , NavigationExtras} from '@angular/router';
import { Storage } from '@ionic/storage';

declare var google;

@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})

@Injectable()


export class SettingPage implements OnInit {

  UserInformation:any;
  phone: string;
  email: string;
  address: string;
  max_dist_pref: any;
  min_dist_pref: any;
  max_age_pref: any;
  min_age_pref: any;
  structure={lower:0,upper:0};
  showprofileOnapp: any;
  rang= { lower:0, upper:0 };
  gender_pref: any;
  Dating_Prefrences=['Male','Female','Transgender'];
  check = [false,false,false];
  BodyType: any;
  pepperoni: any;
  myToast: any;
  postData: any;
  API_URL: string;

  location: any;
  autocomplete: any;

  autocompleteItems:any;
  GoogleAutocomplete:any;
  geocoder:any;
  latitube: any;
  logitude: any;
  info:boolean=false;
  blockUser=[];
  userID:string;
  userExists:boolean;

  constructor( private geolocation: Geolocation, private zone: NgZone, public http:HttpClient, 
   private storage: Storage,private route: ActivatedRoute, public loadingCtrl: LoadingController,private toast: ToastController,
    private alertCtrl: AlertController,private viewCtrl: ModalController,public events: Events,public router: Router) {

      /*if(navParams.get('userExists'))
      {          
      this.userExists=navParams.get('userExists');
      if(!this.userExists)       
       this.viewCtrl.dismiss(false);
      }*/

      this.route.queryParams.subscribe(params => {
            if (params && params.userID) {
              this.userID = JSON.parse(params.userID);
              this.autocompleteItems = [];
              
              this.loadProfile();   
              this.geocoder= new google.maps.Geocoder;
              this.GoogleAutocomplete= new google.maps.places.AutocompleteService();
            }
          });

      
        
      }
      ngOnInit() {
      }

      loadProfile()
      { 
          let postData= new FormData();
          var API_URL='http://jigaju.esy.es/api/getuserdetails';
          postData.append('userid', this.userID);
          let responseData : Observable<any>;
        
              responseData = this.http.post(API_URL,postData);
              responseData.subscribe(data => {
                  
                  this.UserInformation=data.body[0];
                  this.phone=this.UserInformation.phone;
                  this.email = this.UserInformation.email;
                  this.autocomplete = this.UserInformation.address;
                  this.min_dist_pref = this.UserInformation.min_dist_pref;
                  this.max_dist_pref = this.UserInformation.max_dist_pref; 
                  this.max_age_pref = this.UserInformation.max_age_pref; 
                  this.min_age_pref = this.UserInformation.min_age_pref; 
                  this.gender_pref = this.UserInformation.gender_pref; 
                  this.BodyType = this.UserInformation.Body_Type;
                  this.showprofileOnapp = this.UserInformation.showprofileOnapp;
                  this.latitube=this.UserInformation.location_lat;
                  this.logitude=this.UserInformation.location_long;
      
                  this.structure = { lower: this.min_age_pref, upper: this.max_age_pref };
                  this.rang  = { lower: this.min_dist_pref , upper: this.max_dist_pref };
                  var splitted = this.gender_pref.split(","); 
                  //  console.log(splitted)
                  for(let j=0;j<splitted.length ;j++){
                    for(let i=0;i<this.Dating_Prefrences.length ;i++){
                      //console.log(this.check[i]);
                      if(this.Dating_Prefrences[i] === splitted[j]){
                         this.check[i] = true;
                      }
                    }
                  }
                  console.log(this.gender_pref);   
                if(this.showprofileOnapp == 1){
                  this.pepperoni = true;
                }else{
                  this.pepperoni = false;
                }
                console.log(data);
              });
      }

      async saveProfile()
      {
        let alert = await this.alertCtrl.create({
            header: 'Save Profile',
            message: 'Do you want to Save The Changes?',
            buttons: [
              {
                text: 'NO',
                role: 'cancel',
                handler: () => {
                  console.log('NO');
                  console.log('NO',this.gender_pref);
                }
             },
             {
                text: 'YES',
                handler: async () => {
                    console.log('YES');
                    console.log(this.gender_pref);
                    let loader = await this.loadingCtrl.create({
                      message: "Uploading...."
                    });
                    await loader.present();
                      var saveData={phone:this.phone,
                                    address:this.autocomplete,
                                    max_dist_pref:this.rang.upper,
                                    min_dist_pref:this.rang.lower,
                                    max_age_pref:this.structure.upper,
                                    min_age_pref:this.structure.lower,
                                    showprofileOnapp:this.pepperoni,
                                    gender_pref:this.gender_pref,
                                    location_lat:this.latitube,
                                    location_long:this.logitude,
                                  };                            
                                 
                    this.postData= new FormData();
                    this.API_URL='http://jigaju.esy.es/api/update_profile_APP';
                    this.postData.append('id',this.userID);
                    this.postData.append('data',JSON.stringify(saveData));
                    let responseData : Observable<any>;
                    //console.log(saveData);
                    responseData = this.http.post(this.API_URL,this.postData);    
                    responseData.subscribe(async data => {
                                    //console.log(data);
                                    loader.dismiss();
                                    this.myToast = await  this.toast.create({
                                                  message: data.message,
                                                  duration: 3000
                                                });
                                    this.myToast.present();
                                    if(this.UserInformation.address != this.autocomplete ||
                                       this.UserInformation.min_dist_pref != this.rang.upper ||
                                       this.UserInformation.max_dist_pref != this.rang.lower || 
                                       this.UserInformation.max_age_pref != this.structure.upper ||
                                       this.UserInformation.min_age_pref != this.structure.lower ||
                                       this.UserInformation.gender_pref != this.gender_pref
                                       )
                                       this.events.publish('datePreferenceChanged');
                                   //    this.navCtrl.pop();
                                       this.router.navigate(['/'])
                                },async onerror=>{
                                  this.myToast = await this.toast.create({
                                                  message: 'Unable to Save Profile, Internal Error',
                                                  duration: 3000
                                                });
                                    this.myToast.present();
                                    loader.dismiss();
                                });
                  }
              }
           ],
           cssClass: 'alertCustomCss'
        });
        alert.present();
      }
        /*userID(arg0: string, userID: any) {
          throw new Error("Method not implemented.");
        }*/

        updateSearchResults(){
          if (this.autocomplete.input == '') {
            this.autocompleteItems = [];
            return;
          }
          else{
            // new google.maps.places.AutocompleteService().getPlacePredictions({ input: this.autocomplete},
            // alert(this.autocomplete); 
            this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete },
            (predictions, status) => {
              this.autocompleteItems = [];
              this.zone.run(() => {
                predictions.forEach((prediction) => {
                  this.autocompleteItems.push(prediction);
                });
              });
            });
          } 
        }
        selectSearchResult(item){
          this.autocompleteItems = [];
          //this.geocoder= new google.maps.Geocoder;
          this.geocoder.geocode ({'placeId': item.place_id}, (results, status) => {
            if(results[0]){
              this.autocomplete = results[0].formatted_address;
              console.log(this.autocomplete);
              console.log(results[0].geometry.viewport.ha.g+","+results[0].geometry.viewport.da.g);
              this.latitube=results[0].geometry.viewport.ha.g;
              this.logitude=results[0].geometry.viewport.da.g;
            }
          })
        }
        getUserCurrentLocation()
        {
            //alert('hello');
            this.geolocation.getCurrentPosition().then((resp) => {
              console.log(resp);
            }).catch((error)=>{
              console.log('Error getting location', error);
            });
        }
        
          someAction(){
         
            let postData= new FormData();
            var API_URL='http://jigaju.esy.es/api/whoBlockMe';
            postData.append('userid', this.userID);
            let responseData : Observable<any>;
                responseData = this.http.post(API_URL,postData);
                responseData.subscribe(data => {
                    console.log(data);
                    this.blockUser= data;
                    if(data.length>0)
                      this.info=true;
                });
        }

        back(){
          this.info= false;
          this.blockUser= [];
        }
        DatingPrefGrpChange(event){
          //console.log(event);
          //console.log(this.check);
          this.gender_pref='';
          for(let i=0;i<this.check.length ;i++){
            //console.log(this.check[i]);
            if(this.check[i] === true){
              // console.log(this.check[i]);
                if(this.gender_pref === '')
                  this.gender_pref=this.Dating_Prefrences[i];
                else
                  this.gender_pref= this.gender_pref + ',' +this.Dating_Prefrences[i];
            }
          }
          console.log(this.gender_pref);
          //this.gender_pref=event;
       }

       return() {
         this.router.navigate(['/']);
       }

       goto(link){
           let navigationExtras: NavigationExtras = {
                queryParams: {
                  userID: JSON.stringify(this.userID)
                }
              };
           if(link === 'toc'){
             this.router.navigate(["term-of-services"],navigationExtras);
           }else if(link === 'guidelines'){
             this.router.navigate(["term-of-services"],navigationExtras);
           }else if(link === 'policy'){
             this.router.navigate(["term-of-services"],navigationExtras);
           }else if(link === 'subscription'){
             this.router.navigate(["term-of-services"],navigationExtras);
           }else if(link === 'tips'){
             this.router.navigate(["term-of-services"],navigationExtras);
           }else if(link === 'help'){
             this.router.navigate(["term-of-services"],navigationExtras);
           } 
           
           
         }
}
