import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AuthService } from "../services/auth.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { ApiService } from '../services/api.service';
import { GlobalVarService } from '../services/global-var.service';
import { ToastController } from "@ionic/angular";


@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {


  signupform;
  matchPassword: boolean;
  pass: any;
  cnfPass: any;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private api: ApiService,
    private toastCtrl: ToastController,
    private _gblSrc: GlobalVarService
  ) { }


  ngOnInit() {

    this.signupform = this.formBuilder.group({
      email: ['', Validators.email],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      age: [false, Validators.requiredTrue]
    });

  }

  async getPassword(e) {
    this.pass = await e.target.value;
    console.log("password input", this.pass);
  }

  async getCnfPassword(e) {
    this.cnfPass = await e.target.value;
    console.log("conf pass", this.cnfPass);
    if (this.cnfPass === this.pass) {
      console.log("password matched")
      const toaster = await this.toastCtrl.create({
        duration: 1000,
        color: 'success',
        message: 'Password & Confirm Password Matched',
        position: 'bottom'
      });
      toaster.present();
    } else {
      console.log("password not matched");
      const toaster = await this.toastCtrl.create({
        duration: 1000,
        color: 'warning',
        message: 'Password & Confirm Password Does not match',
        position: 'bottom'
      });
      toaster.present();

    }
  }

  getCredentials() {
    let data = {
      "email": this.signupform.value.email,
      "password": this.signupform.value.password
    }
    console.log("Sign up data", data);
    this._gblSrc.signupEmailAndPass = data;

  }
  signin(){
    this.router.navigate(['splash']);
  }


  async signup() {
    // console.log(this.signupform.value.email);
    if (this.signupform.value.email == '' && this.signupform.value.password == '' && this.signupform.value.confirmPassword == '' && this.signupform.value.age == false) {
      const toaster = await this.toastCtrl.create({
        duration: 1000,
        message: 'Please enter fields',
        position: 'bottom'
      });
      toaster.present();
      return;
    }
    else if (this.signupform.value.email == '') {
      const toaster = await this.toastCtrl.create({
        duration: 1000,
        message: 'Please enter   a valid email',
        position: 'bottom'
      });
      toaster.present();
      return;
    }
    else if (this.signupform.value.password == '') {
      const toaster = await this.toastCtrl.create({
        duration: 1000,
        message: 'Please Enter Password',
        position: 'bottom'
      });
      toaster.present();
      return;
    }
    else if (this.signupform.value.password.length < 7) {
      const toaster = await this.toastCtrl.create({
        duration: 1000,
        message: 'Password is not strong. Try giving more than six characters',
        position: 'bottom'
      });
      toaster.present();
      return;
    }

    else if (this.signupform.value.confirmPassword == '') {
      const toaster = await this.toastCtrl.create({
        duration: 1000,
        message: 'Please confirm the password',
        position: 'bottom'
      });
      toaster.present();
      return;
    }
    else if (this.signupform.value.password != this.signupform.value.confirmPassword) {

      const toaster = await this.toastCtrl.create({
        duration: 1000,
        message: 'Password & Confirm Password Does not match',
        position: 'bottom'
      });
      toaster.present();
      return;
    }
    else if (this.signupform.value.age == false) {
      const toaster = await this.toastCtrl.create({
        duration: 1000,
        message: 'Please confirm you are 18+',
        position: 'bottom'
      });
      toaster.present();
      return;
    }
    else {
      console.log("else",this.signupform);
      console.log("else",this.signupform.getError());
      if(this.signupform.status === 'VALID'){
        if (this.pass != this.cnfPass) {
          return
        } else {
          this.getCredentials();
          this.router.navigate(['profilebuilder1']);
        }
      }else{
        const toaster = await this.toastCtrl.create({
          duration: 1000,
          message: 'Invalid Email',
          position: 'bottom'
        });
        toaster.present();
        return;
      }
    }
  }
}
