import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
//import { NavController, ToastController,AlertController, NavParams, Events} from 'ionic-angular';
import { ToastController, NavParams, LoadingController, IonContent } from '@ionic/angular';
import { Events } from '../../app/services/events.service';
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";

import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';
//import { ProfilePage } from '../profile/profile';
//import { ChattingPage } from '../chatting/chatting';
// import { GlobalVariableProvider } from '../../providers/global-variable/global-variable';
//import { RequestsProvider } from '../../providers/requests/requests';
import { ChatService } from '../services/chat.service';
import { GlobalVarService } from "../services/global-var.service";
import { ApiService } from "../services/api.service";

@Component({
  selector: 'app-chatting',
  templateUrl: './chatting.page.html',
  styleUrls: ['./chatting.page.scss'],
})
export class ChattingPage implements OnInit {

  @ViewChild('content') content: IonContent;
  buddy: any;
  myUID: string;
  friend: any;
  newmessage;
  allmessages = [];
  photoURL;
  displayName;
  imgornot;
  friendid: any;
  UserDetail: any;
  constructor(public http: HttpClient, public zone: NgZone, public route: ActivatedRoute, public chatservice: ChatService,
    public events: Events, public loadingCtrl: LoadingController, private router: Router,
    public _gblSrc: GlobalVarService) {
    this.route.queryParams.subscribe(params => {
      this.friendid = params.friendid;//navParams.get('friendid');
      this.UserDetail = params.userid;//navParams.get('userid');
      this.friend = {
        uid: params.friend,//navParams.get('friend'),
        displayName: params.friendName,//navParams.get('friendName'),
        photoURL: 'http://jigaju.esy.es/uploads/thumbnail/' + params.friend_image//navParams.get('friend_image')
      };
    });
    console.log('this._gblSrc.this.UserDetail', this.UserDetail);
    console.log('this._gblSrc.currectUserAllDetails', this._gblSrc.currectUserAllDetails);
    this.myUID = this._gblSrc.currectUserAllDetails.ejuser;
    //this.buddy = this.chatservice.buddy;
    this.photoURL = 'http://jigaju.esy.es/uploads/thumbnail/' + this._gblSrc.currectUserAllDetails.profile_image;
    this.displayName = this._gblSrc.currectUserAllDetails.fname;
    this.scrollto();

    this.events.subscribe('newmessage', () => {
      this.allmessages = [];
      this.imgornot = [];
      this.zone.run(() => {
        this.allmessages = this.chatservice.buddymessages;
        console.log(this.allmessages);
        this.scrollto();
        for (var key in this.allmessages) {
          if (this.allmessages[key].message.substring(0, 4) == 'http')
            this.imgornot.push(true);
          else
            this.imgornot.push(false);
        }
      })
    })
    let Data = new FormData();
    var URL = 'http://jigaju.esy.es/api/NotificationRecived';
    Data.append('sender_id', this.friendid);
    Data.append('reciver_id', this.UserDetail);
    Data.append('is_read', 'false');
    let resData: Observable<any>;
    resData = this.http.post(URL, Data);
    resData.subscribe(data => {
      console.log(data);
      this.events.publish('is_read');
    });
  }
  ngOnInit() {
  }

  back() {
    //this.navCtrl.pop();
    this.router.navigate(['/'])

  }
  addmessage() {
    if (this.newmessage) {
      let postData = new FormData();
      var API_URL = 'http://jigaju.esy.es/api/chatnotification';
      postData.append('user_id', this.UserDetail);
      postData.append('friend_id', this.friendid);
      let responseData: Observable<any>;
      responseData = this.http.post(API_URL, postData);
      responseData.subscribe(data => {
        console.log(data);
      });
      this.chatservice.addnewmessage(this.newmessage, this.myUID, this.friend.uid).then(() => {
        
        this.newmessage = '';
        this.content.scrollToBottom();


      })
      let Data = new FormData();
      var URL = 'http://jigaju.esy.es/api/NotificationRecived';
      Data.append('sender_id', this.UserDetail);
      Data.append('reciver_id', this.friendid);
      Data.append('is_read', 'true');
      let resData: Observable<any>;
      resData = this.http.post(URL, Data);
      resData.subscribe(data => {
        console.log(data);
      });
    }
  }

  ionViewDidEnter() {
    this.chatservice.getbuddymessages(this.myUID, this.friend.uid);
    this.scrollto();
  }

  scrollto() {
    setTimeout(() => {
      this.content.scrollToBottom();
    }, 1000);
  }

  sendPicMsg() {
    /*let loader = this.loadingCtrl.create({
      content: 'Please wait'
    });
    loader.present();
    this.imgstore.picmsgstore().then((imgurl) => {
      loader.dismiss();
      this.chatservice.addnewmessage(imgurl).then(() => {
        this.scrollto();
        this.newmessage = '';
      })
    }).catch((err) => {
      alert(err);
      loader.dismiss();
    })*/
  }





}
