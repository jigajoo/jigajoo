import { Component, OnInit } from '@angular/core';
//import { NavController} from '@ionic/angular';
import { Router } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-matchcheckout',
  templateUrl: './matchcheckout.page.html',
  styleUrls: ['./matchcheckout.page.scss'],
})
export class MatchcheckoutPage implements OnInit {

  content=[];
  info: boolean=false;
  matchcheck=[];
  hide: boolean=true;
 
  UserDetail: any;
  URL: string;

  constructor(private storage: Storage, public http:HttpClient,public router: Router) {
    this.storage.get('name').then((val) => {       
          this.UserDetail=val.id;            
          let postData= new FormData();
          var API_URL='http://jigaju.esy.es/api/getmylikedetails';
          postData.append('userid',this.UserDetail);
          let responseData : Observable<any>;
              responseData = this.http.post(API_URL,postData);
              responseData.subscribe(data => {  
                if(data) 
                this.content= data.body;    
              }); 
            });
  }
  ngOnInit() {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MatchcheckoutPage');
  }
  matchcheckout(val){
   
   this.hide= true;
   document.getElementById("x").style.pointerEvents = "none";
  let postData= new FormData(); 
  var API_URL='http://jigaju.esy.es/api/getmylikedetails';
  postData.append('userid',val);
  let responseData : Observable<any>;
      responseData = this.http.post(API_URL,postData);
      responseData.subscribe(data => {  
        if(data){
        this.matchcheck= data.body;
        this.info= true;
        }else{
          this.info= false;
          this.hide= true;
          this.matchcheck=[];
          document.getElementById("x").style.pointerEvents = "auto";
        }
      }); 
}

back(){
  this.info= false;
  this.hide= true;
  this.matchcheck=[];
  document.getElementById("x").style.pointerEvents = "auto";
}

return() {
  this.router.navigate(['/']);
}
}
