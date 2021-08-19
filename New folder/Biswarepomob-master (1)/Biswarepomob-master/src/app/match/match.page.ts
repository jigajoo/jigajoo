import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { Router, ActivatedRoute } from "@angular/router";
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-match',
  templateUrl: './match.page.html',
  styleUrls: ['./match.page.scss'],
})
export class MatchPage implements OnInit {
content =[];
mainMatchProfiles:any;
userID:string;
  constructor(private router: Router, private route: ActivatedRoute,
    public http: HttpClient) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
          if (params && params.userID) {
            this.userID = JSON.parse(params.userID);
            this.loadMatchProfile(this.userID);
          }});
  }

  back() {
    this.router.navigate(['/'])
  }

  loadMatchProfile(id: string) {
    let postData = new FormData();
    var API_URL = 'http://jigaju.esy.es/api/search_match_APP';
    postData.append('id', this.userID);
    let responseData: Observable<any>;
     responseData = this.http.post(API_URL, postData);
    responseData.subscribe(data => {
      console.log(data);
      this.mainMatchProfiles = data.content;
      if (this.mainMatchProfiles.length > 1) {
        this.content.push(this.mainMatchProfiles.shift());
        this.content.push(this.mainMatchProfiles.shift());
      } else if (this.mainMatchProfiles.length > 0 && this.mainMatchProfiles.length < 2) {
        this.content.push(this.mainMatchProfiles.shift());
      }
      console.log(this.mainMatchProfiles);
      console.log(this.content);
      if (!data) {
        console.log('No Match Found');
        //this.navCtrl.push(SplashPage);
        //this.router.navigate(['SplashPage']);
      }
    }, onerror => {
      console.log('Network Or Server Error, Unable to Login' + JSON.stringify(onerror));
      //this.navCtrl.push(SplashPage);
      this.router.navigate(['SplashPage']);
    });
  }

}
