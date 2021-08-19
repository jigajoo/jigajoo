import { Component, OnInit } from '@angular/core';
import {  AlertController } from '@ionic/angular';
import { Router } from "@angular/router";
//import { UserProvider } from '../../providers/user/user';
import { AuthService } from "../services/auth.service";
import { ToastController } from "@ionic/angular";


@Component({
  selector: 'app-passwordreset',
  templateUrl: './passwordreset.page.html',
  styleUrls: ['./passwordreset.page.scss'],
})
export class PasswordresetPage implements OnInit {
  email: string;
  constructor(public router: Router, private authservice :AuthService, private toastCtrl: ToastController,) {
  }

  ionViewDidLoad() {
  }


  ngOnInit() {
  }

  async reset() {

    /*let alert = await this.alertCtrl.create({
      buttons: ['Ok'],
      cssClass: 'alertCustomCss',
    });*/
    this.authservice.passwordreset(this.email).then(async (res: any) => {
      console.log(res);
      if (res.success) {
        //alert('Email Sent');
        const toaster = await this.toastCtrl.create({
          duration: 1000,
          color: 'success',
          message: 'Email Sent',
          position: 'bottom'
        });
        toaster.present();
   //     await alert.setTitl('Email Sent');
     //   await alert.setSubTitle('Please follow the instructions in the email to reset your password');
      }
      else{
        //alert('Error');
        const toaster = await this.toastCtrl.create({
                duration: 1000,
                color: 'warning',
                message: 'Error',
                position: 'bottom'
              });
              toaster.present();
    //    alert.setTitle('Error');
    //    alert.setSubTitle(res.message);
      }
     // alert.present();
    }).catch(async (err) => {
      // alert('Failed');
      const toaster = await this.toastCtrl.create({
        duration: 1000,
        color: 'warning',
        message: 'Failed',
        position: 'bottom'
      });
      toaster.present();
  //    alert.setTitle('Failed');
 //     alert.setSubTitle(err);
      //alert.present();
    })
  }

  goback() {
   // this.navCtrl.pop();
    this.router.navigate(['splash'])
  }

}
