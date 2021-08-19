import { Component, OnInit } from '@angular/core';
//import { NavParams } from '@ionic/angular';
//import {Observable} from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";

@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.page.html',
  styleUrls: ['./myprofile.page.scss'],
})
export class MyprofilePage implements OnInit {

  all_about: string = "gallery";

  constructor(public router: Router,public http:HttpClient) {
  }  
  ngOnInit() {
  }

profile = [
  {image: "assets/imgs/man2.png"},
  {image: "assets/imgs/man2.png"},
  {image: "assets/imgs/man2.png"},
  {image: "assets/imgs/man2.png"},
  {image: "assets/imgs/man2.png"},
  {image: "assets/imgs/man2.png"},
  {image: "assets/imgs/man2.png"},
  {image: "assets/imgs/man2.png"},
  {image: "assets/imgs/man2.png"},
  {image: "assets/imgs/man2.png"},
  {image: "assets/imgs/man2.png"},
  {image: "assets/imgs/man2.png"},
  {image: "assets/imgs/man2.png"},
  {image: "assets/imgs/man2.png"},
  {image: "assets/imgs/man2.png"},
  {image: "assets/imgs/man2.png"},
  {image: "assets/imgs/man2.png"},
  {image: "assets/imgs/man2.png"},
  {image: "assets/imgs/man2.png"},
  {image: "assets/imgs/man2.png"},
  {image: "assets/imgs/man2.png"},
  {image: "assets/imgs/man2.png"}
];

insight(){
 this.router.navigate(['insight']);
} 

setting(){
 this.router.navigate(['setting']);
}
editprofile(){
 this.router.navigate(['editprofile']);
}
back(){
  this.router.navigate(['/']);
}

}
