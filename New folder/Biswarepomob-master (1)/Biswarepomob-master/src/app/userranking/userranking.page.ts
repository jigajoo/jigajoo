import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ToastController } from "@ionic/angular";



@Component({
  selector: 'app-userranking',
  templateUrl: './userranking.page.html',
  styleUrls: ['./userranking.page.scss'],
})
export class UserrankingPage implements OnInit {
  content = [];
  allImage = [];
  count = 0;
  contentwholike: any;
  show: boolean = true;
  userID: any;
  friendsid = [];
  myToast: any;

  constructor(public http: HttpClient, public router: Router, private route: ActivatedRoute, private toast: ToastController) {

    this.route.queryParams.subscribe(params => {
      if (params && params.userID) {
        this.userID = JSON.parse(params.userID);
        var API_URL = 'http://jigaju.esy.es/api/getuseralldetails';
        let responseData: Observable<any>;
        let postData = new FormData();
        postData.append('userid', this.userID);
        responseData = this.http.post(API_URL, postData);
        responseData.subscribe(data => {
          console.log(data);
          this.content = data.rankUser;
          if (data.My_Friends && data.My_Friends.length > 0)
            this.friendsid = data.My_Friends[0].MyFrind.split(',');
          else
            this.friendsid = [];
        });
      }
    });
  }

  ngOnInit() {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserrankingPage');
  }

  profile(userID) {
    //this.navCtrl.push(ProfilePage,{id:userID});
    let navigationExtras: NavigationExtras = {
      queryParams: {
        id: userID
      }
    };
    this.router.navigate(['profile'], navigationExtras);
  }

  like(like: any, position: number) {
    this.show = false;
    let postData = new FormData();
    let responseData: Observable<any>;
    let API_URL: string;
    postData.append('user_id', this.userID);
    postData.append('friend_id', like);
    API_URL = 'http://jigaju.esy.es/api/friend_like_APP';
    responseData = this.http.post(API_URL, postData);
    responseData.subscribe(async data => {
      this.friendsid.push(like);
      this.myToast = await this.toast.create({
        message: data.message,
        duration: 3000
      });
      this.myToast.present();
    }, onerror => {
      console.log('Network Or Server Error While Adding Friend');
    });
  }

  back() {
    this.router.navigate(['/'])
  }

}