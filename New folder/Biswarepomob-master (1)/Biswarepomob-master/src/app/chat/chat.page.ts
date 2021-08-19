import { Component, OnInit } from '@angular/core';
//import { NavController, ToastController,AlertController, NavParams, Events} from 'ionic-angular';
import { ToastController, NavParams, AlertController} from '@ionic/angular';
import { Events } from '../../app/services/events.service';
import { Router,ActivatedRoute, NavigationExtras } from "@angular/router";

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
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  isDisabledContent:  boolean=true;
  UserDetail: any;
  profileInfo=[];
  img_profile=[];
  info: boolean=true;
  friendid: string;
  content=[];
  contentwishlist=[];
  contentwholike=[];
  datauser: any;
  i:any;
  j:any;
  hideMe: boolean=false;
  hide: boolean=false;
  message=[];

  constructor(private storage: Storage,
    public http:HttpClient, 
    private _gblSrc: GlobalVarService, public events:Events,private router: Router,
    private route: ActivatedRoute,private apiservice: ApiService,
    public chatservice:ChatService,private alertCtrl: AlertController ,private toast: ToastController) {
    this.route.queryParams.subscribe(params => {
          if (params && params.userID) {
            this.UserDetail = JSON.parse(params.userID);
            let postData= new FormData();          
            var API_URL='http://jigaju.esy.es/api/getfrienddetails';
            postData.append('userid',this.UserDetail);
            let responseData : Observable<any>;        
                responseData = this.http.post(API_URL,postData);
                responseData.subscribe(data => {
                  console.log(data);  
                  if(data) 
                    this.content= data.body;           
                }); 
             
              let Data= new FormData();          
              var URL='http://jigaju.esy.es/api/getNotificationRecived';
              Data.append('sender_id',this.UserDetail);
              let resData : Observable<any>;        
                  resData = this.http.post(URL,Data);
                  resData.subscribe(data => { 
                    this.message=data;
                    console.log(data);       
                  }); 
                this.events.subscribe('is_read', () => {
                    let Data= new FormData();          
                    var URL='http://jigaju.esy.es/api/getNotificationRecived';
                    Data.append('sender_id',this.UserDetail);
                    let resData : Observable<any>;        
                        resData = this.http.post(URL,Data);
                        resData.subscribe(data => { 
                          this.message=data;
                          console.log(data);       
                        }); 
                  });
          }
        });
    console.log("this.UserDetail",this.UserDetail);
    // this.UserDetail=navParams.get('id');      
         

  }

  ngOnInit() {
  }

  back() {
    //this.navCtrl.pop();
    this.router.navigate(['/'])

  }

  chat(){
    this.info = true;
    this.hide = false;
    this.hideMe = false;
    document.getElementById("heart").style.color = "#635e5e";
    document.getElementById("heart2").style.color = "#635e5e";
    document.getElementById("chatboxesid").style.color = "#fe2829";
    document.getElementById("chatboxesid2").style.color = "#fe2829";
    document.getElementById("bookmarks").style.color = "#635e5e";
    document.getElementById("bookmarks2").style.color = "#635e5e";

    this.storage.get('name').then((val) => {       
     
      this.UserDetail=val.id;            
     
      let postData= new FormData();
      
      var API_URL='http://jigaju.esy.es/api/getfrienddetails';
      postData.append('userid',this.UserDetail);
      let responseData : Observable<any>;
    
          responseData = this.http.post(API_URL,postData);
          responseData.subscribe(data => {
            if(data)   
              this.content= data.body;
       
          }); 
      
        });
  }
  wholike(){
    this.info = false;
    this.hide = false;
    this.hideMe = true;
    document.getElementById("heart").style.color = "#fe2829";
    document.getElementById("heart2").style.color = "#fe2829";
    document.getElementById("chatboxesid").style.color = "#635e5e";
    document.getElementById("chatboxesid2").style.color = "#635e5e";
    document.getElementById("bookmarks").style.color = "#635e5e";
    document.getElementById("bookmarks2").style.color = "#635e5e";
    this.storage.get('name').then((val) => {       
     
      this.UserDetail=val.id;            
     
      let postData= new FormData();
      
      var API_URL='http://jigaju.esy.es/api/getfriendlikeyou';
      postData.append('userid',this.UserDetail);
      let responseData : Observable<any>;
    
          responseData = this.http.post(API_URL,postData);
          responseData.subscribe(data => {  
            if(data)  
            this.contentwholike= data.body;
       
          }); 
      
        });

  }
  wishlist(){
    this.info = false;
    this.hide = true;
    this.hideMe = false;
    document.getElementById("heart").style.color = "#635e5e";
    document.getElementById("heart2").style.color = "#635e5e";
    document.getElementById("chatboxesid").style.color = "#635e5e";
    document.getElementById("chatboxesid2").style.color = "#635e5e";
    document.getElementById("bookmarks").style.color = "#fe2829";
    document.getElementById("bookmarks2").style.color = "#fe2829";
    this.storage.get('name').then((val) => {       
     
      this.UserDetail=val.id;            
     
      let postData= new FormData();
      
      var API_URL='http://jigaju.esy.es/api/getfriendwishlist';
      postData.append('userid',this.UserDetail);
      let responseData : Observable<any>;
    
          responseData = this.http.post(API_URL,postData);
          responseData.subscribe(data => {  
            if(data)  
            this.contentwishlist= data.body;
      
          }); 
      
        });
  }
  like(like: any,position:number) 
  {      
      document.getElementById('likes' + like).style.display="none";
      this.storage.get('name').then((val) => {  
      let postData= new FormData(); 
      let responseData : Observable<any>; 
      let API_URL:string;
      postData.append('user_id',val.id);
      postData.append('friend_id',like);
      API_URL='http://jigaju.esy.es/api/friend_like_APP';
      responseData = this.http.post(API_URL,postData);    
      responseData.subscribe(async data => {            
            this.contentwholike.splice(position,1);
            console.log(data.friendDetail.ejuser);
            this.apiservice.acceptrequest(this._gblSrc.currectUserAllDetails.ejuser,data.friendDetail.ejuser);
            var to = await this.toast.create({
               message:"Liked Successfully",
               duration: 3000
             })
            await to.present();
          },onerror=>{
                console.log('Network Or Server Error While Adding Friend');
              });
            });
  }
  dislike(dislike: any,position:number) 
  {
    
    document.getElementById('likes' + dislike).style.display="none";
      this.storage.get('name').then((val) => {  
      let postData= new FormData(); 
      let responseData : Observable<any>; 
      let API_URL:string;
      postData.append('user_id',val.id);
      postData.append('friend_id',dislike);
    API_URL='http://jigaju.esy.es/api/friend_dislike_APP';
      responseData = this.http.post(API_URL,postData);    
      responseData.subscribe(async data => {
            this.contentwholike.splice(position,1);
            console.log(data); 
            var to = await this.toast.create({
              message:"Disliked",
              duration: 3000
            })
           await to.present();
          },onerror=>{
                console.log('Network Or Server Error While Adding Friend');
              });
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

  wishlike(like,point,position:number) {  
      this.storage.get('name').then((val) => {  
      let postData= new FormData(); 
      let responseData : Observable<any>; 
      let API_URL:string;
      console.log(val.id); 
      console.log(like); 
      postData.append('user_id',val.id);
      postData.append('friend_id',like);
      postData.append('rating',point);
    API_URL='http://jigaju.esy.es/api/friend_likewishlist_APP';
      responseData = this.http.post(API_URL,postData);    
      responseData.subscribe(async data => {
            console.log(data); 
            if(data) {
                  this.contentwishlist.splice(position,1);
                  document.getElementById('dislikes' + like).style.display="none";
                  var to = await this.toast.create({
                     message:"Liked",
                     duration: 3000
                   })
                  await to.present();
            }
          },onerror=>{
                console.log('Network Or Server Error While Adding Friend');
              });
            });
}
wishdislikefriend(dislike,point,position:number) {
  this.storage.get('name').then((val) => {  
    let postData= new FormData(); 
    let responseData : Observable<any>; 
    let API_URL:string;
    postData.append('user_id',val.id);
    postData.append('friend_id',dislike);
    postData.append('rating',point);
  API_URL='http://jigaju.esy.es/api/friend_dislike_APP';      
  responseData = this.http.post(API_URL,postData);    
  responseData.subscribe(async data => {
      console.log(data);
      if(data) {
        this.contentwishlist.splice(position,1);
        document.getElementById('dislikes' + dislike).style.display="none";
        var to = await this.toast.create({
           message:"Disliked wihlisted",
           duration: 3000
         })
        await to.present();
      } 
    },onerror=>{
          console.log('Network Or Server Error While Adding Friend');
        
        });
      });
}

async  blockuser(friend,position:number){
    let alert = await this.alertCtrl.create({
      //title: 'Confirm Block',
      message: 'Do you want to Block this user ?',
      cssClass: 'alertCustomCss',
      inputs: [
        {
          name: 'comment',
          placeholder: 'Reason to block?',
          value:''
        },
      
      ],
      buttons: [
        {
          text: 'NO',
          role: 'cancel',
          handler: () => {
            console.log('NO');
          }
        },
        {
          text: 'YES',
          handler:async data => {
            console.log(JSON.stringify(data)); //to see the object
            console.log(data.comment);
            if (data.comment) {
        let postData= new FormData(); 
        let responseData : Observable<any>; 
        let API_URL:string;
        postData.append('id',this.UserDetail);
        postData.append('blockid',friend);
        postData.append('blockstatus','1');
        postData.append('comment',data.comment);
        API_URL='http://jigaju.esy.es/api/blockuser_APP';      
        responseData = this.http.post(API_URL,postData);    
        responseData.subscribe(async data => {
            console.log(data);
            this.content.splice(position,1);
            
            var to = await this.toast.create({
               message:"Blocked Successfully",
               duration: 3000
             })
            await to.present();
            document.getElementById(friend).style.display="none";
          },async onerror=>{
                console.log('Network Or Server Error While Adding Friend');
              
              });
          
          } else {
           var to = await this.toast.create({
              message:"Enter valid Reason to Block",
              duration: 3000
            })
           await to.present();
            return false;
          }
        }
        }
      ]
    });
    alert.present();

    }
// blockuser(friend,position:number){
//   let alert = this.alertCtrl.create({
//     title: 'Confirm Block',
//     message: 'Do you want to Block this user ?',
//     cssClass: 'alertCustomCss',
//     inputs: [
//       {
//         name: 'comment',
//         placeholder: 'Reason to block?',
//         value:''
//       },
    
//     ],
//     buttons: [
//       {
//         text: 'NO',
//         role: 'cancel',
//         handler: () => {
//           console.log('NO');
//         }
//       },
//       {
//         text: 'YES',
//         handler: data => {
//           console.log(JSON.stringify(data)); //to see the object
//           console.log(data.comment);
//           if (data.comment) {
//       let postData= new FormData(); 
//       let responseData : Observable<any>; 
//       let API_URL:string;
//       postData.append('id',this.UserDetail);
//       postData.append('blockid',friend);
//       postData.append('blockstatus','1');
//       postData.append('comment',data.comment);
//       API_URL='http://jigaju.esy.es/api/blockuser_APP';      
//       responseData = this.http.post(API_URL,postData);    
//       responseData.subscribe(data => {
//           console.log(data);
//           this.content.splice(position,1);
//           document.getElementById(friend).style.display="none";
//         },onerror=>{
//               console.log('Network Or Server Error While Adding Friend');
            
//             });
        
//         } else {
//           // this.toast.create({
//           //   message:"Enter valid Reason to Block",
//           //   duration: 3000
//           // }).present();
//           return false;
//         }
//       }
//       }
//     ]
//   });
//  // alert.present();

//   }

  chatFriend(friendUID:string,friendName:string,friend_image:string,friendID:string)
  {
    this.chatservice.initializebuddy(friendUID);
    let navigationExtras: NavigationExtras = {
        queryParams: {
          friendid:friendID,
          userid:this.UserDetail,
          friend:friendUID,
          friendName:friendName,
          friend_image:friend_image
        }
      };
   this.router.navigate(['chatting'],navigationExtras);
  //  this.navCtrl.push(ChattingPage,{friendid:friendID,userid:this.UserDetail,friend:friendUID,friendName:friendName,friend_image:friend_image});
  }
}
