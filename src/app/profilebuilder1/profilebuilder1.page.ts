import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Crop } from '@ionic-native/crop';
import { File } from '@ionic-native/file/ngx';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router ,NavigationExtras } from "@angular/router";
import { Geolocation } from '@ionic-native/geolocation/ngx';

import { AuthService } from "../services/auth.service";
import { GlobalVarService } from "../services/global-var.service";

import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { LoadingController, ToastController } from "@ionic/angular";
import { Storage } from '@ionic/storage';
// import { File, FileEntry } from '@ionic-native/File/ngx';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-profilebuilder1',
  templateUrl: './profilebuilder1.page.html',
  styleUrls: ['./profilebuilder1.page.scss'],
})
export class Profilebuilder1Page implements OnInit {



  picture: any;
  base64Image: any;
  input_name: any
  Profile_image: any
  latitude: any
  longitude: any
  coOrdinates: any
  userID: any
  uploadedImageName: any
  uid: any
  Date_Of_Birth: any
  profilrbuilderForm: FormGroup;
  image:any;
  croppedImagepath = "";

  constructor(
    private toast: ToastController,
    private router: Router,
    private loader: LoadingController,
    private camera: Camera,
    private _gblSrc: GlobalVarService,
    //private crop: Crop,
    private file: File,
    private formBuilder: FormBuilder,
    private _authSrc: AuthService,
    private geolocation: Geolocation,
    private transfer: FileTransfer,
    private nativeGeocoder: NativeGeocoder,
    private storage: Storage, private sanitizer: DomSanitizer
  ) {

  }


  ngOnInit() {
    if (this._gblSrc.signupEmailAndPass == null) {
      this.router.navigate(["/signup"]);
    }
    this.profilrbuilderForm = this.formBuilder.group({
      avatarName: null,
      avatarLocation: null,
      avatarDOB: null
    });
    // this.createUser();
    // this.getCurrentUserLocation();
  }





  getCurrentUserLocation() {
    this.geolocation.getCurrentPosition().then((res) => {
      console.log("location response", res);
      this.latitude = res.coords.latitude;
      this.longitude = res.coords.longitude;
      console.log("location response", this.latitude);
      console.log("location response", this.longitude);
      // this.coOrdinates = this.latitude + "," + this.longitude;
      console.log("Co-ordinates", this.coOrdinates);

      let options: NativeGeocoderOptions = {
          useLocale: true,
          maxResults: 5
      };

      this.nativeGeocoder.reverseGeocode(this.latitude, this.longitude, options)
        .then((result: NativeGeocoderResult[]) => {
            console.log(JSON.stringify(result[0]));
            this.coOrdinates = result[0].subLocality + "," + result[0].locality;
          })
        .catch((error: any) => console.log(error));

      // let options: NativeGeocoderOptions = {
      //   useLocale: true,
      //   maxResults: 5
      // };
      // this.nativeGeocoder.reverseGeocode(res.coords.latitude, res.coords.latitude, options)
      //   .then((result: NativeGeocoderResult[]) => console.log("Location results", JSON.stringify(result[0])))
      //   .catch((error: any) => console.log("hello",error));
    }).catch((err) => {
      console.log("Getting error", err);
    })
  }




  async selectOption() {
    console.log("Hitting the function");

    const toast = await this.toast.create({
      duration: 100000,
      buttons: [
        {
          side: 'start',
          icon: 'camera',
          handler: () => {
            console.log('Camera clicked');
            this.getPicture(1);
          }
        }, {
          icon: 'images',
          handler: () => {
            console.log('Gallery clicked');
            this.getPicture(0);
          }
        }
      ]
    });

    toast.present();
  }

  getPicture(val) {
    console.log("val", val);
    console.log("val", JSON.stringify(this.camera.DestinationType));
    // destinationType: this.camera.DestinationType.DATA_URL,
    let win: any = window; 
    if(val == 0){//gallery
      let options = {
        quality: 100,
        // allowEdit: true,
        sourceType: val,
        destinationType: this.camera.DestinationType.FILE_URI,
        //  encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
      }

      this.camera.getPicture(options).then((imageData) => {
          // imageData is either a base64 encoded string or a file URI
          // If it's base64 (DATA_URL):
          //let base64Image = 'data:image/jpeg;base64,' + imageData;
          this.Profile_image = imageData;
          console.log('Cropped Image Path! this.Profile_image : imageData' + imageData);
          this.file.resolveLocalFilesystemUrl( 'file://'+imageData).then(fileEntry => {
            console.log('Cropped Image Path! this.fileEntry : ' + fileEntry );
             //this.image = this.sanitizer.bypassSecurityTrustHtml(fileEntry.toInternalURL());//
             //(<any>window).Ionic.WebView.convertFileSrc(fileEntry.toInternalURL());
             //this.sanitizeUrl(fileEntry.toInternalURL());
             //this.image = fileEntry.toInternalURL();////fileEntry.nativeURL;
             console.log('Cropped Image Path! this.im : ' + this.image );
          });
          console.log('Cropped Image Path! thisss.im : ','file://'+imageData );
           //this.image= 'data:image/jpeg;base64,' + imageData;// imageData;
          this.image = (<any>window).Ionic.WebView.convertFileSrc(imageData);
          //win.Ionic.WebView.convertFileSrc('file://'+imageData);
          //this.sanitizeUrl(base64Image);
          //this.image= 'file://'+imageData;
          console.log('Cropped Image Path! thissss.im : ' + this.image );
           console.log('Cropped Image Path! this.Profile_image : ' + this.Profile_image );
        }, (err) => {
          console.log(err);
          // Handle error
        });

      /*this.camera.getPicture(options).then((imageData) => {
        //this.file.resolveLocalFilesystemUrl(imageData).then(fileEntry => {

          // imageData = fileEntry.nativeURL;
           //this.photoSelected = true;
           //this.photoTaken = false;
            //console.log('Cropped Image Path!: ' + imageData);
           //return imageData;
         //});
        //this.base64Image = 'data:image/jpeg;base64,' + imageData;
         //console.log('Cropped Image Path!: ' + imageData);
         // console.log('Cropped Image Path!: ' + this.base64Image);
         imageData += '?' + +new Date();
         console.log('Cropped Image Path!: ' + imageData);
         return imageData;
      }).then((path) => {
         console.log('Cropped Image Path!: ' + path);
        //this.Profile_image = 'data:image/jpeg;base64,' + path;
        this.Profile_image = path;
        this.image= this.sanitizeUrl(path);
        // this.Profile_image =  path;
        console.log('Cropped Image Path! this.Profile_image : ' + this.Profile_image );


      });*/
    }else{
      let options = {
        quality: 100,
        // allowEdit: true,
        sourceType: val,
        destinationType: this.camera.DestinationType.FILE_URI,
        // encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
      }

      this.camera.getPicture(options).then((imageData) => {
        //this.base64Image = 'data:image/jpeg;base64,' + imageData;
         console.log('Cropped Image Path!: ' + imageData);
         // console.log('Cropped Image Path!: ' + this.base64Image);
         imageData += '?' + +new Date();
         console.log('Cropped Image Path!: ' + imageData);
        return imageData;
      }).then((path) => {
         console.log('Cropped Image Path!: ' + path);
        // this.Profile_image = 'data:image/jpeg;base64,' + path;
        this.image=(<any>window).Ionic.WebView.convertFileSrc(path);
        this.Profile_image =  path;
        console.log('Cropped Image Path! this.Profile_image : ' + this.Profile_image );

      });
    }
    


  }

  sanitizeUrl(url) {
      return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  saveUserImage(img_name: string, image: any) {
    let fileTransfer: FileTransferObject = this.transfer.create();
    var date = new Date();
    var timeStamp = date.getFullYear() + date.getMonth() + date.getDate() + date.getHours() + date.getMinutes() + date.getMilliseconds();

    var imageUploadServerName = img_name + "_" + timeStamp + "_" + this.userID + ".jpg";
    console.log("imageUploadServerName", imageUploadServerName);

    let options: FileUploadOptions = {
      fileKey: img_name,
      fileName: imageUploadServerName,
      params: { "id": this.userID },
      mimeType: "image/jpeg",
      // headers: {Connection: 'close'}
    }
    console.log("options", options);
    console.log("imagein line 76", image);

    fileTransfer.upload(image, 'http://jigaju.esy.es/api/edit_gallery_images_APP', options)
      .then(data => {
        console.log(JSON.stringify(data));
        console.log(data);
        console.log("Image Uploaded Successfully");
        if (img_name === 'profile_image') {
          this._gblSrc.profileImage = imageUploadServerName
          console.log("Profile image", this._gblSrc.profileImage);

          //   this.events.publish('ProfileImageChange');
          //   this.userservice.updateimage(imageUploadServerName);
        }
      }, error => {
        console.log("error calling api ", error);
      }
      );
  }


  validateForm(data)
   {  
      var val ={error:false,message:''};
      if(!data.name ){
        val = {error:true,message:'Please provide Name'};
      }
      else if(!data.dob){
        val = {error:true,message:'Please provide Date of birth'};
      }else if(data.dob){
        let userDob= data.dob.split('T')[0];
        let isEligible = this.isEligibleAge(userDob);
        if(!isEligible){
          val = {error:true,message:'Eligible for 18+ only'};
        }
      }
      return val;
   }


  async onSubmit() {
    let data = {
      "image": this.Profile_image,
      "name": this.profilrbuilderForm.value.avatarName,
      "location": this.profilrbuilderForm.value.avatarLocation,
      "dob": this.profilrbuilderForm.value.avatarDOB,
    }
    console.log("data", data);
    let val = this.validateForm(data);
    if(!val.error){
      this.createUser();
    } else{
      const toast = await this.toast.create({
        message: val.message,
        duration: 2000
      });
      toast.present();
    }
  }

  isEligibleAge(birthday) { // birthday is a date
    var split_dob = birthday.split("-");
    var year = split_dob[0];
    var month = split_dob[1];
    var day = split_dob[2];
    var dob_asdate = new Date(year, month, day);
    let ageDifMs = Date.now() - dob_asdate.getTime();
    var age = Math.floor(ageDifMs / (1000 * 3600 * 24 * 365.25));
    return age>=18;
  }

  cropImage(fileUrl) {
    Crop.crop(fileUrl, { quality: 50 })
      .then(
        newPath => {
          this.showCroppedImage(newPath.split('?')[0])
        },
        error => {
          alert('Error cropping image' + error);
        }
      );
  }

  showCroppedImage(ImagePath) {
    // this.isLoading = true;
    var copyPath = ImagePath;
    var splitPath = copyPath.split('/');
    var imageName = splitPath[splitPath.length - 1];
    var filePath = ImagePath.split(imageName)[0];

    this.file.readAsDataURL(filePath, imageName).then(base64 => {
      this.croppedImagepath = base64;
    }, error => {
      alert('Error in showing image' + error);
    });
  }






  async createUser() {
    const loading = await this.loader.create({
      cssClass: 'my-custom-class',
      message: 'Logging In...',
      duration: 2000
    });
    await loading.present();
    let postData = new FormData();
    var apiEndPoint = "/api/registerUser";
    let signupData = this._gblSrc.signupEmailAndPass;
    console.log("signupData", signupData);
    let email = signupData.email
    let password = signupData.password
    console.log("signupemail", email);
    console.log("signupData", password);
    postData.append('email', signupData.email);
    postData.append('fname', this.profilrbuilderForm.value.avatarName);
    postData.append('device_token', signupData.email + '_Browser');
    postData.append('device', 'browser');
    await this._authSrc.postApiCall(apiEndPoint, postData).then(async (data) => {
      console.log("data1", JSON.stringify(data));
      if (!data['error'] && !data['exists']) {
        this.userID = data['body']['id'];
        console.log("userId", this.userID);
        let date = new Date();
        let timestamp = date.getFullYear() + '' + date.getMonth() + '' + date.getDate() + '' + date.getHours() + '' + date.getMinutes() + '' + date.getMilliseconds();
        this.uploadedImageName = "profile_image_" + timestamp + "_" + this.userID + ".jpg";
        await this._authSrc.signup(signupData.email, signupData.password,this.input_name,this.Profile_image).then(async (data) => {
          console.log("signupFiredata", data);
          this.uid = data.user.uid;
          let newEndPoint = "/api/loginApi_APP"
          await this._authSrc.postApiCall(newEndPoint, postData).then(async (data) => {
            console.log("DATA___@@", data);
            this._gblSrc.userId = data['loginUserDetails']['id'];
            this.storage.set('name',{"id": data['loginUserDetails']['id']})  // Store User in Local Storage
            localStorage.setItem("isLogin","true");
            this._gblSrc.id = data['loginUserDetails']['id'];
            this.saveUserImage('profile_image', this.Profile_image); 
            var saveData = {
              fname: this.profilrbuilderForm.value.avatarName,
              address: null,
              location_lat: this.latitude,
              location_long: this.longitude,
              dob: this.profilrbuilderForm.value.avatarDOB,
              profile_image: this.Profile_image,
              ejuser: this.uid
            };
            console.log("saveData", saveData);
            postData = new FormData();
            let newEndPoint1 = '/api/update_profile_APP';
            postData.append('id', this.userID);
            postData.append('data', JSON.stringify(saveData));
            await this._authSrc.postApiCall(newEndPoint1, postData).then((data) => {
              console.log("Updated data", data);
              let navigationExtras: NavigationExtras = {
                   queryParams: {
                     userID: JSON.stringify(this.userID)
                   }
                 };
              this.router.navigate(['/profilebuilder'],navigationExtras);
            }), async error => {
              loading.dismiss();
              const toast = await this.toast.create({
                message: 'Unable to update profile',
                duration: 2000
              });
              toast.present();
            };
          }), async error => {
            loading.dismiss();
            const toast = await this.toast.create({
              message: 'Unable to register profile in DB',
              duration: 2000
            });
            toast.present();
          }
        }), async error => {
          loading.dismiss();
          const toast = await this.toast.create({
            message: 'Unable to register profile in Firebase',
            duration: 2000
          });
          toast.present();
        }
      } else if(data['exists']) {
         loading.dismiss();
        const toast = await this.toast.create({
          message: data['message'] || 'This email is already in use. Please try with different email address',
          duration: 2000
        });
        toast.present();
      }

    }), async error => {  
      loading.dismiss();
      const toast = await this.toast.create({
        message: 'Unable to register profile in DB',
        duration: 2000
      });
      toast.present();
    }

  }

  back() {
    this.router.navigate(['/']);
  }

}
