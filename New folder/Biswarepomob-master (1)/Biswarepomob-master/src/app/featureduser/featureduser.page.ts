import { Component, OnInit } from '@angular/core';
//import { NavController} from '@ionic/angular'
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';
import { Router,NavigationExtras,ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-featureduser',
  templateUrl: './featureduser.page.html',
  styleUrls: ['./featureduser.page.scss'],
})
export class FeatureduserPage implements OnInit {

  content=[];
  UserDetail: any;

  constructor(private storage: Storage, public http:HttpClient,public router: Router ,private route:ActivatedRoute) {
     this.route.queryParams.subscribe(params => {
           
           // this.userID = JSON.parse(params.userID);  
        this.UserDetail=params.userID;            
        let postData= new FormData();
        var API_URL='http://jigaju.esy.es/api/getfeatureduser';
        postData.append('userid',this.UserDetail);
        postData.append('featureid','23');
        let responseData : Observable<any>;
            responseData = this.http.post(API_URL,postData);
            responseData.subscribe(data => { 
              console.log(data); 
              if(data) 
              this.content= data.body;    
            }); 
          });
     }
  
    ngOnInit() {
    }
  
      ionViewDidLoad() {
      //console.log('ionViewDidLoad FeatureduserPage');
    }

    back() {
      this.router.navigate(['/']);
    }
   }
