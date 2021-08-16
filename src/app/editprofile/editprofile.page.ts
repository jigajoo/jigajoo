import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { LoadingController, ToastController,Platform } from "@ionic/angular";
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import  { Camera }  from '@ionic-native/camera/ngx';
import { Crop } from '@ionic-native/crop';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer/ngx';
import { ApiService } from "../services/api.service";
import { GlobalVarService } from "../services/global-var.service";
import { AuthService } from "../services/auth.service";
import { Events } from '../../app/services/events.service';


import { ModalController} from '@ionic/angular';


declare var google;

@Component({
  selector: 'app-editprofile',
  templateUrl: './editprofile.page.html',
  styleUrls: ['./editprofile.page.scss'],
})
export class EditprofilePage implements OnInit {

    //firedata = firebase.database().ref('/users');
    userID:string;
    email:string;
    userExists:boolean;
    postData= new FormData(); 
    responseData : Observable<any>; 
    API_URL:string;
    gallary:any;
    Calander_Display: boolean=false;
    showUploadOption: boolean=false;
  
  //--------- Form Fields Declared Here ------------------------
  Profile_image:any;
  Gallay_Image1:any;
  Gallay_Image2:any;
  Gallay_Image3:any;
  Gallay_Image4:any;
  Gallay_Image5:any;
  Profile_image_Previous:any;
  Gallay_Image1_Previous:any;
  Gallay_Image2_Previous:any;
  Gallay_Image3_Previous:any;
  Gallay_Image4_Previous:any;
  Gallay_Image5_Previous:any;
  selectedImageToUpload:string;
  input_name:string; 
  autocomplete:any;
  Movie:string;
  song:string;
  Hobbies:string;
  Gender:string ="Male";
  Date_Of_Birth:string;
  Secret:string;
  BodyType:string; 
  body_type_Grp:string; // Group Variable
  Date_Pref_Grp:string; // Group Variable
  gender_pref:string='';
  Education:string;
  Education_Grp:string;  // Group Variable
  Carrier_Grp:string; // Group Variable
  profession:string;
  latitube:string;
  image:any = '';
  image1:any = '';
  image2:any = '';
  image3:any = '';
  image4:any = '';
  image5:any = '';
  logitude:string;

  //------------------------------------------------------------


    //------------------------------------------------------------
    base64Image : any;
    picture: any;
    myToast: any;
    userProfileInfo:any;
    body_type=['Muscular','Slim','Plus Size'];
    Dating_Prefrences=['Male','Female','Transgender'];
    Education_List=['Masters','High School','School'];
    Carrier_List=['Job','Business','Student'];
    Gender_list=[{label:'Male',value:'male'},{label:'Female',value:'female'},{label:'Others',value:'others'}];
  
   //--------------- Variables for Calander -----------------------

  constructor(
    private geolocation: Geolocation,
      private camera:Camera,public http:HttpClient,private platform:Platform,
      public events: Events,public loadingCtrl: LoadingController,private toast: ToastController,
      private transfer: FileTransfer,private viewCtrl: ModalController,private apiservice: ApiService,
              private _authSrc: AuthService,
    private _gblSrc: GlobalVarService,
    private route: ActivatedRoute,
      public router: Router) {

        this.route.queryParams.subscribe(params => {
          if (params && params.userID) {
            this.userID = JSON.parse(params.userID);
            this.loadProfile();   
          }
        });
  }

  ionViewCanEnter(){
    this.loadProfile();
   }
 
   loadProfile()
   {
       //console.log(this.userID);  
       this.postData= new FormData();
       this.API_URL='http://jigaju.esy.es/api/getuserdetails';
       this.postData.append('userid',this.userID);
       let responseData : Observable<any>;
 
       responseData = this.http.post(this.API_URL,this.postData);    
       responseData.subscribe(data => {
               //console.log(data);              
                 this.userProfileInfo=data.body[0];
                 this.input_name= this.userProfileInfo.fname;
                 this.autocomplete= this.userProfileInfo.address;
                 this.Gender= this.userProfileInfo.gender;
                 this.Date_Of_Birth=this.userProfileInfo.dob;
                 this.Movie= this.userProfileInfo.Favrouit_Movie;
                 this.song= this.userProfileInfo.Favrouit_Song;
                 this.Hobbies= this.userProfileInfo.Hobbies;
                 this.Secret= this.userProfileInfo.Hidden_Secret;
                 this.BodyType = this.userProfileInfo.Body_Type;
                 this.gender_pref=this.userProfileInfo.gender_pref;
                 this.Education=this.userProfileInfo.education;
                 this.profession =this.userProfileInfo.profession;
                 this.latitube=this.userProfileInfo.location_lat;
                 this.logitude=this.userProfileInfo.location_long;
               this.gallary=data.gallary;
               if(this.userProfileInfo.profile_image)
               {
                 this.image='http://jigaju.esy.es/uploads/'+this.userProfileInfo.profile_image;
                 this.Profile_image_Previous=this.Profile_image;
               }  
               else
                 this.image='assets/icon/img_input.svg'; 
 
                if(this.gallary && this.gallary.img1)
                {
                  this.image1='http://jigaju.esy.es/uploads/'+this.gallary.img1;
                  this.Gallay_Image1_Previous=this.Gallay_Image1;
                }  
                else
                  this.image1='assets/icon/img_input.svg';
               
                if(this.gallary && this.gallary.img2)
                {
                  this.image2='http://jigaju.esy.es/uploads/'+this.gallary.img2;
                  this.Gallay_Image2_Previous=this.Gallay_Image2;
                }
                else
                  this.image2='assets/icon/img_input.svg';
               
                if(this.gallary && this.gallary.img3)
                {
                  this.image3='http://jigaju.esy.es/uploads/'+this.gallary.img3;
                  this.Gallay_Image3_Previous=this.Gallay_Image3;
                }
                else
                  this.image3='assets/icon/img_input.svg';
               
                if(this.gallary && this.gallary.img4)
                {
                  this.image4='http://jigaju.esy.es/uploads/'+this.gallary.img4;
                  this.Gallay_Image4_Previous=this.Gallay_Image4;
                }
                else
                  this.image4='assets/icon/img_input.svg';
               
                if(this.gallary && this.gallary.img5)
                {
                  this.image5='http://jigaju.esy.es/uploads/'+this.gallary.img5;
                  this.Gallay_Image5_Previous=this.Gallay_Image5;
                }
                else
                  this.image5='assets/icon/img_input.svg';               
                 
               if(data.error)
               {
                 console.log(data.message);
               }           
             },onerror=>{
             console.log('Unable to fetch gallary');
       });
   }

  async saveProfile()
  {
    if(!this.validateInput()) // Exit function if Validation fails
      return;
    let alert = await this.toast.create({
        header: 'Save Profile',
        cssClass: 'alertCustomCss',
        message: 'Do you want to Save The Changes?',
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
            handler: async () => {
                //console.log('YES');
                let loader = await this.loadingCtrl.create({
                  message: "Uploading...."
                });

                await loader.present();
                // if(this.Profile_image != 'assets/icon/img_input.svg' && this.Profile_image != this.Profile_image_Previous)
                //   this.saveUserImages('profile_image',this.Profile_image);  // Save Profile Image
                // if(this.Gallay_Image1 != 'assets/icon/img_input.svg' && this.Gallay_Image1 != this.Gallay_Image1_Previous)
                //   this.saveUserImages('img1',this.Gallay_Image1);  // Save Gallay_Image1 Image                
                // if(this.Gallay_Image2 != 'assets/icon/img_input.svg' && this.Gallay_Image2 != this.Gallay_Image2_Previous)
                //   this.saveUserImages('img2',this.Gallay_Image2);  // Save Gallay_Image2 Image 
                // if(this.Gallay_Image3 != 'assets/icon/img_input.svg' && this.Gallay_Image3 != this.Gallay_Image3_Previous)
                //   this.saveUserImages('img3',this.Gallay_Image3);  // Save Gallay_Image3 Image
                // if(this.Gallay_Image4 != 'assets/icon/img_input.svg' && this.Gallay_Image4 != this.Gallay_Image4_Previous)
                //   this.saveUserImages('img4',this.Gallay_Image4);  // Save Gallay_Image4 Image 
                // if(this.Gallay_Image5 != 'assets/icon/img_input.svg' && this.Gallay_Image5 != this.Gallay_Image5_Previous)
                //   this.saveUserImages('img5',this.Gallay_Image5);  // Save Gallay_Image5 Image
                if(this.image != '' && this.image != 'assets/icon/img_input.svg')
                  this.saveUserImages('profile_image',this.Profile_image);  // Save Profile Image
                if(this.image1 != '' && this.image1 != 'assets/icon/img_input.svg')
                  this.saveUserImages('img1',this.Gallay_Image1);  // Save Gallay_Image1 Image                
                if(this.image2 != '' && this.image2 != 'assets/icon/img_input.svg')
                  this.saveUserImages('img2',this.Gallay_Image2);  // Save Gallay_Image2 Image 
                if(this.image3 != '' && this.image3 != 'assets/icon/img_input.svg')
                  this.saveUserImages('img3',this.Gallay_Image3);  // Save Gallay_Image3 Image
                if(this.image4 != '' && this.image4 != 'assets/icon/img_input.svg')
                  this.saveUserImages('img4',this.Gallay_Image4);  // Save Gallay_Image4 Image 
                if(this.image5 != '' && this.image5 != 'assets/icon/img_input.svg')
                  this.saveUserImages('img5',this.Gallay_Image5);  // Save Gallay_Image5 Image              
                  var saveData={fname:this.input_name,
                                address:this.autocomplete,
                                Favrouit_Movie:this.Movie,
                                Favrouit_Song:this.song,
                                Hobbies:this.Hobbies,
                                Hidden_Secret:this.Secret,
                                Body_Type:this.BodyType,
                                gender_pref:this.gender_pref,
                                education:this.Education,
                                profession:this.profession,
                                //location_lat:this.latitube,
                                //location_long:this.logitude,
                                gender:this.Gender,
                                dob:this.Date_Of_Birth
                              };
                //console.log(saveData);
                this.postData= new FormData();
                this.API_URL='http://jigaju.esy.es/api/update_profile_APP';
                this.postData.append('id',this.userID);
                this.postData.append('data',JSON.stringify(saveData));
                let responseData : Observable<any>;
          
                responseData = this.http.post(this.API_URL,this.postData);    
                responseData.subscribe(async data => {
                                if(this.input_name != this.userProfileInfo.fname)
                                {
                                    this._authSrc.updatedisplayname(this.input_name);
                                    this._gblSrc.profileDispalyName=this.input_name;
                                    this.events.publish('ProfileNameChange');
                                }
                                if(this.gender_pref!=this.userProfileInfo.gender_pref)
                                    this.events.publish('datePreferenceChanged');
                                this.myToast =await this.toast.create({
                                              message: data.message,
                                              duration: 5000
                                            });
                                this.myToast.present();
                                //this.navCtrl.pop(); 
                                this.router.navigate(['/'])
                            },async onerror=>{
                              this.myToast = await this.toast.create({
                                              message: 'Unable to Save Profile, Internal Error',
                                              duration: 3000
                                            });
                              this.myToast.present();
                            });
                  loader.dismiss();
              }              
          }
       ]
    });
    await alert.present();
  }

  saveUserImages(image_name:string,image:any)
  {
    const fileTransfer: FileTransferObject = this.transfer.create();
    var date=new Date();
    var timeStamp=date.getFullYear()+''+date.getMonth()+''+date.getDate()+''+date.getHours()+''+date.getMinutes()+''+date.getMilliseconds();
    
    var imageUploadServerName=image_name+"_"+timeStamp+"_"+this.userID+".jpg";
    let options: FileUploadOptions = {
      fileKey: image_name,
      fileName: imageUploadServerName,
      chunkedMode: false,
      params:{"id":this.userID},
      mimeType: "image/jpeg",
      headers: {}
    }
    fileTransfer.upload(image,'http://jigaju.esy.es/api/edit_gallery_images_APP',options)
                .then(data => { console.log(JSON.stringify(data));
                                console.log(data);
                                console.log("Image Uploaded Successfully");
                                if(image_name === 'profile_image'){
                                  this._gblSrc.profileImage=imageUploadServerName
                                  this.events.publish('ProfileImageChange');
                                  this._authSrc.updateimage(imageUploadServerName);
                                }
                              }, error => { 
                                      console.log("error calling api " + JSON.stringify(error));
                              }
                      );
  }
 
  async validateInput()
   {
       let alert = await this.toast.create({
        header: 'Mandatory Parameter is Misssing !!',
        cssClass: 'alertCustomCss',
        buttons: [
          {
            text: 'OK'
          }]
        });
       if(!this.Profile_image || this.Profile_image === 'assets/icon/img_input.svg')
       {
          //alert.setMessage('Please Upload Profile Picture.');
          await alert.present();
          return false;
       }
       if(!this.input_name || this.input_name === '')
       {
          //alert.setMessage('Please Provide Name.');
          await alert.present();
          return false;
       } 
       if(this.Date_Of_Birth === '')
       {
          //alert.setMessage('Please Provide Date of Birth.');
          await alert.present();
          return false;
       }
       if(!this.Gender)
       {
          //alert.setMessage('Please Select Gender.');
          await alert.present();
          return false;
       }    
      return true;
   }

  ngOnInit() {
    //this.Gender = 'Others'
  }

  UploadImageFromMedia(imagePlace)
  {
    this.showUploadOption=true;
    this.selectedImageToUpload=imagePlace;
  }
  UploadImageFromMediaClose()
  {
    this.showUploadOption=false;
  }

  AccessGallery(selectedSource){
   //console.log(selectedSource+'   '+this.selectedImageToUpload);
   this.showUploadOption=false;
   this.camera.getPicture({
      // allowEdit: true,
      quality: 100,  
      sourceType: selectedSource,
      destinationType: this.camera.DestinationType.FILE_URI  
     }).then((ImageData) => {  
       if (this.platform.is('ios')) {
         return ImageData
       } else if (this.platform.is('android')) {  
          if(selectedSource == 0){//gallery          
            switch(this.selectedImageToUpload) { 
                 case 'Profile_Image': { 
                     this.Profile_image = ImageData; 
                     this.image=(<any>window).Ionic.WebView.convertFileSrc('file://'+ImageData);
                     // this.Profile_image =  path;
                     return ImageData;//Crop.crop(ImageData, { quality: 100, targetWidth: -1, targetHeight: -1 });  
                 } 
                 case 'Gallary1': { 
                     this.Gallay_Image1 =  ImageData; 
                     this.image1=(<any>window).Ionic.WebView.convertFileSrc('file://'+ImageData);
                     return ImageData;//Crop.crop(ImageData, { quality: 100, targetWidth: -1, targetHeight: -1 });   
                 }
                 case 'Gallary2': { 
                     this.Gallay_Image2 =  ImageData; 
                     this.image2=(<any>window).Ionic.WebView.convertFileSrc('file://'+ImageData);
                     return ImageData;//Crop.crop(ImageData, { quality: 100, targetWidth: -1, targetHeight: -1 }); 
                 }
                 case 'Gallary3': { 
                     this.Gallay_Image3 = ImageData; 
                     this.image3=(<any>window).Ionic.WebView.convertFileSrc('file://'+ImageData);
                     return ImageData;//Crop.crop(ImageData, { quality: 100, targetWidth: -1, targetHeight: -1 }); 
                 }
                 case 'Gallary4': { 
                     this.Gallay_Image4 = ImageData; 
                     this.image4=(<any>window).Ionic.WebView.convertFileSrc('file://'+ImageData);
                     return ImageData;// Crop.crop(ImageData, { quality: 100, targetWidth: -1, targetHeight: -1 });   
                 }
                 case 'Gallary5': { 
                     this.Gallay_Image5 = ImageData; 
                     this.image5=(<any>window).Ionic.WebView.convertFileSrc('file://'+ImageData);
                     return ImageData;//Crop.crop(ImageData, { quality: 100, targetWidth: -1, targetHeight: -1 });  
                 }
            } 
          }else{
            switch(this.selectedImageToUpload) { 
              case 'Profile_Image': { 
                  this.Profile_image = ImageData; 
                  this.image=(<any>window).Ionic.WebView.convertFileSrc(ImageData);
                  // this.Profile_image =  path;
                  return ImageData;//Crop.crop(ImageData, { quality: 100, targetWidth: -1, targetHeight: -1 });  
              } 
              case 'Gallary1': { 
                  this.Gallay_Image1 =  ImageData; 
                  this.image1=(<any>window).Ionic.WebView.convertFileSrc(ImageData);
                  return ImageData;//Crop.crop(ImageData, { quality: 100, targetWidth: -1, targetHeight: -1 });   
              }
              case 'Gallary2': { 
                  this.Gallay_Image2 = ImageData;//'data:image/jpeg;base64,' + ImageData; 
                  this.image2=(<any>window).Ionic.WebView.convertFileSrc(ImageData);
                  return ImageData;//Crop.crop(ImageData, { quality: 100, targetWidth: -1, targetHeight: -1 }); 
              }
              case 'Gallary3': { 
                  this.Gallay_Image3 = ImageData;//'data:image/jpeg;base64,' + ImageData; 
                  this.image3=(<any>window).Ionic.WebView.convertFileSrc(ImageData);
                  return ImageData;//Crop.crop(ImageData, { quality: 100, targetWidth: -1, targetHeight: -1 }); 
              }
              case 'Gallary4': { 
                  this.Gallay_Image4 = ImageData;//'data:image/jpeg;base64,' + ImageData; 
                  this.image4=(<any>window).Ionic.WebView.convertFileSrc(ImageData);
                  return ImageData;//Crop.crop(ImageData, { quality: 100, targetWidth: -1, targetHeight: -1 });   
              }
              case 'Gallary5': { 
                  this.Gallay_Image5 = ImageData;//'data:image/jpeg;base64,' + ImageData;
                  this.image5=(<any>window).Ionic.WebView.convertFileSrc(ImageData); 
                  return ImageData;//Crop.crop(ImageData, { quality: 100, targetWidth: -1, targetHeight: -1 });  
              }
            }
          }
       }
     })
     .then((path) => {
       console.log('Cropped Image Path!: ' + path);
       //this.picture=path;
       //this.base64Image=path;
       //this.input_name=path+" y";
       //this.Profile_image.src=path;
     })  
  }

  back() {
    this.router.navigate(['/'])
  }
}
