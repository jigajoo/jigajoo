import { Component, OnInit } from '@angular/core';
import { NavParams,AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router ,ActivatedRoute} from "@angular/router";
import { GlobalVarService } from "../services/global-var.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {
  all_about: string = "gallery";
  img_profile: string;
  profession: string;
  userID:any;
  education: string;
  address: string;
  Hobbies: string;
  Hidden_Secret: string;
  Favrouit_Movie: string;
  Favrouit_Song: string;
  message: string;
  about: string;
  fname:string;
  lname:string;
  age:any;
  aboutinfo:string;
  udata:any;
    constructor(public http:HttpClient,private _gblSrc: GlobalVarService,private alertCtrl: AlertController,public router:Router,private route: ActivatedRoute) {
      this.route.queryParams.subscribe(async params => {
            if (params && params.id) {
              this.userID = JSON.parse(params.id);
              await this.getuserdata(this.userID);
              
              console.log(this.userID);
              let Data= new FormData();          
              var URL='http://jigaju.esy.es/api/viewCount';
              Data.append('userid',this.userID);
              let resData : Observable<any>;        
                  resData = this.http.post(URL,Data);
                  resData.subscribe(data => {
                    console.log(data);       
                  }); 
            }
          });
          //this.userID=navParams.get('id');
          
      }

      getuserdata(uid){
        //this.UserDetail=val.id;            
                    let postData= new FormData();
                    var API_URL='http://jigaju.esy.es/api/getuserdetails';
                    postData.append('userid', this.userID);
                    let responseData : Observable<any>;
                        responseData = this.http.post(API_URL,postData);
                        responseData.subscribe(data => {
                            console.log(data);
                            if(!data.error){                      
                              var items=data.body[0];
                              this.udata = data.body[0]; 
                              //this._gblSrc.currectUserAllDetails=items;
                              this.img_profile='http://jigaju.esy.es/uploads/thumbnail/'+this.udata.profile_image;
                              this.img_profile='http://jigaju.esy.es/uploads/thumbnail/'+this.udata.profile_image;
                              console.log(this.img_profile);
                              this.profession = this.udata.profession;
                              this.education = this.udata.education;
                              this.address = this.udata.address;
                              this.Hobbies = this.udata.Hobbies;
                              this.Hidden_Secret = this.udata.Hidden_Secret;
                              this.Favrouit_Movie = this.udata.Favrouit_Movie;
                              this.Favrouit_Song = this.udata.Favrouit_Song;
                              this.about = this.udata.about;

                               
                            }
                            else{
                              console.log('Unable to fetch info for userid ('+this.userID+') '+data.message);
                              // this.Mainpage = SplashPage;
                            }                                   
                        },onerror=>{
                          console.log(JSON.stringify(onerror.message)+'Unable to fetch info for userid '+this.userID);
                          //this.Mainpage = SplashPage;
                        });   
      }

      async presentConfirm(val) {
        this.message ='';
        switch(val) { 
          case 'Career': { 
            if(this.profession)
              this.message = this.profession; 
              break;
          } 
          case 'Favourite Music': {
            if(this.Favrouit_Song) 
              this.message = this.Favrouit_Song; 
              break;
          }
          case 'Favourite Movies': { 
            if(this.Favrouit_Movie)
            this.message = this.Favrouit_Movie; 
            break;
          }
          case 'Hobbies & Interest': { 
          if(this.Hobbies)
          this.message = this.Hobbies; 
          break;
          }
          case 'Secrets': { 
            if(this.Hidden_Secret)
            this.message = this.Hidden_Secret; 
            break;
         }
         case 'Location': { 
          if(this.address)
          this.message = this.address; 
          break;
          }
         case 'Education': { 
          if(this.education)
          this.message = this.education; 
          break;
          }
          case 'Basic Info': { 
            if(this.userID.fname)
            this.fname=this.userID.fname;
            else
            this.fname='';
            if(this.userID.lname)
            this.lname=this.userID.lname;
            else
            this.lname='';
            if(this.userID.age)
            this.age=this.userID.age;
            else
            this.age='';
            if(this.about)
            this.aboutinfo=this.about;
            else
            this.aboutinfo='';
            this.message = 'Name: '+this.fname+' '+this.lname+ '<br><br> Age: '+this.age+'<br><br> About: '+this.aboutinfo; 
            break;
         }
        }
        let alert = await this.alertCtrl.create({
           header: val,
           message: this.message,
          
           buttons: [
           
             {
               text: 'Ok',
               handler: () => {
                 console.log('Ok');
                 }
               }
            ],
            cssClass: 'alertCustomCss'
           });
       
           await alert.present();
      }
  
         goBack()
         {
           //this.navctl.pop();
           this.router.navigate(['/']);
         }
  }
