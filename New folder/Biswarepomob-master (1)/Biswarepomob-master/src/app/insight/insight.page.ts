import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute , NavigationExtras} from '@angular/router';
import { HttpClient } from '@angular/common/http'; 
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-insight',
  templateUrl: './insight.page.html',
  styleUrls: ['./insight.page.scss'],
})
export class InsightPage implements OnInit {
profile: string = "today";
content=[];
userID:string;
  constructor(private router:Router,public http:HttpClient, private storage: Storage,private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
          if (params && params.userID) {
            this.userID = JSON.parse(params.userID);
            let postData= new FormData();
            var API_URL='http://jigaju.esy.es/api/getvisityourprofile';
            postData.append('userid', this.userID);
            let responseData : Observable<any>;
                responseData = this.http.post(API_URL,postData);
                responseData.subscribe(data => 
                {
                    this.content = data;
                    console.log(data);
                   

                });
          }
        });
   }

   rating(hotrating){
    //this.navCtrl.push(UserratingPage,{hotrating:hotrating});
    let navigationExtras: NavigationExtras = {
         queryParams: {
           hotrating: hotrating
         }
       };
    this.router.navigate(['UserratingPage'],navigationExtras);
   }

  ngOnInit() {
  }

  back() {
    this.router.navigate(['/']);
  }

}
