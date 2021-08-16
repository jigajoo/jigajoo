import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';

import { ViewChild, ElementRef} from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GlobalVarService } from "../services/global-var.service";

declare var google;

@Component({
  selector: 'app-mappoint',
  templateUrl: './mappoint.page.html',
  styleUrls: ['./mappoint.page.scss'],
})
export class MappointPage implements OnInit {

  @ViewChild('map') mapElement: ElementRef;
  matchList=[];
  userID:string;

 constructor(public router: Router,private route: ActivatedRoute,public http:HttpClient,private _gblSrc: GlobalVarService) {
   // this.userID= this.navParams.get('id');
   // this.userID = "516";
   this.route.queryParams.subscribe(params => {
          if (params && params.userID) {
            this.userID = JSON.parse(params.userID);
            console.log("matchList",this.userID);
            this.loadMap();
          }
        });
  }

  ngOnInit() {
  }

  ionViewDidLoad() {
    //this.loadMap();
  }

  loadMap(){
    console.log("matchList",this.userID);
    let postData= new FormData();
    var API_URL='http://jigaju.esy.es/api/search_match_APP';
    postData.append('id',this.userID);
    let responseData : Observable<any>;
    responseData = this.http.post(API_URL,postData);    
    responseData.subscribe(data => {
        console.log(data);
        this.matchList.push(this._gblSrc.currectUserAllDetails);
        if(data && data.content.length>0)
          for(let i=0;i<data.content.length;i++)
              this.matchList.push(data.content[i]);
          console.log("matchList",this.matchList);
        this.loadMatchMap();
      },onerror=>{
          console.log('Network Or Server Error, Unable to Login');
        });    
  }// ---------- Load Function Ends Here --------------------------
 
  
  loadMatchMap()
  {
      console.log("matchList",this.matchList);
      var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: new google.maps.LatLng(this.matchList[0].location_lat,this.matchList[0].location_long),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
      })
      console.log("matchList map",map);
      
      var myoverlay = new google.maps.OverlayView();
      myoverlay.draw = function () {
        //this assigns an id to the markerlayer Pane, so it can be referenced by CSS
        this.getPanes().markerLayer.id='markerLayer'; 
      };
      myoverlay.setMap(map);

      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(this.matchList[0].location_lat,this.matchList[0].location_long),
        map: map,
        animation : google.maps.Animation.DROP
      })

      var i,image;
      var markerList = [];
      for (i = 0; i < this.matchList.length; i++) { 
          var mapContentinfo;
          if(this.matchList[i].OnlineStatus==0){
            image = {
              url: 'assets/icon/offline.png',
              size: new google.maps.Size(40, 40),
              scaledSize: new google.maps.Size(40, 40),
              origin: new google.maps.Point(0,0),
              optimized:false};
          }
          else{
            image = {
              url: 'assets/icon/online.png',
              size: new google.maps.Size(40, 40),
              scaledSize: new google.maps.Size(40, 40),
              origin: new google.maps.Point(0,0),
              optimized:false
            };
          }
          
          marker = new google.maps.Marker({
            position: new google.maps.LatLng(this.matchList[i].location_lat,this.matchList[i].location_long),
            map: map,
            icon : image,
            iconLevel1 : image,
            animation : google.maps.Animation.DROP
          })

          if(i==0)
            mapContentinfo = this.matchList[i].fname;
          else
            mapContentinfo = this.matchList[i].fname+", "+this.matchList[i].age;            
          attachMessage(marker, mapContentinfo);
          
          image = {
                    url: 'http://jigaju.esy.es/uploads/thumbnail/'+this.matchList[i].profile_image,
                    size: new google.maps.Size(70, 70),
                    scaledSize: new google.maps.Size(70, 70),
                    origin: new google.maps.Point(0,0),
                    optimized:false
                  };

          marker.iconLevel2 = image;
          markerList.push(marker);

      } /*-------------- For Loop Ends Here --------------------*/

      function attachMessage(marker, secretMessage) {
        var infowindow = new google.maps.InfoWindow({
          content: '<font color="#272727">'+secretMessage+'</font>'
        });
        marker.addListener('click', function() {
          infowindow.open(marker.get('map'), marker); 
        });
      }
      

      map.addListener('zoom_changed', function() {
          if(map.getZoom()>=14)
          {
            for (i = 0; i < markerList.length; i++) {
              markerList[i].setIcon(markerList[i].iconLevel2);
            }
          }
          else
          {
            for (i = 0; i < markerList.length; i++) {
              markerList[i].setIcon(markerList[i].iconLevel1);
            }
          }
      });
  }

  back() {
    this.router.navigate(['/']);
  }

}
