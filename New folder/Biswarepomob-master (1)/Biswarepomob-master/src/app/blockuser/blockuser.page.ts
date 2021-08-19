import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute , NavigationExtras} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-blockuser',
  templateUrl: './blockuser.page.html',
  styleUrls: ['./blockuser.page.scss'],
})
export class BlockuserPage implements OnInit {
  content =[];
  allImage =[];
  count=0;
  userID:string;
  constructor(private router:Router,public http:HttpClient, private storage: Storage,private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
          if (params && params.userID) {
            this.userID = JSON.parse(params.userID);
            let postData= new FormData(); 
            postData.append('userid',this.userID);
            var API_URL='http://jigaju.esy.es/api/getblockuser';
            let responseData : Observable<any>;
                responseData = this.http.post(API_URL,postData);
                responseData.subscribe(data => 
                {
                    console.log(data);
                    this.content = data;
                    //allImage=3;

                });
          }
        });
  }

  profile(userID){
   //this.navCtrl.push(ProfilePage,{id:userID});
   let navigationExtras: NavigationExtras = {
     queryParams: {
       id: userID
     }
   };
    this.router.navigate(['profile'],navigationExtras);

  }

  back() {
    this.router.navigate(['/']);
  }

}
