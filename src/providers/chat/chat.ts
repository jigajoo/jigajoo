import { Injectable } from '@angular/core';
//import firebase from 'firebase';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFireDatabase } from '@angular/fire/database';
import { Events } from '../../app/services/events.service';

@Injectable()
export class ChatProvider {
  //firebuddychats = firebase.database().ref('/buddychats');
  buddy: any;
  buddymessages = [];
  constructor(public events: Events,public db: AngularFireDatabase,
    private afauth: AngularFireAuth,) {
    
  }

  initializebuddy(buddy) {
    this.buddy = buddy;
  }

  addnewmessage(msg:string,sender:string,friend:string) {
    if(this.buddy){
      var promise = new Promise((resolve, reject) => {
      this.db.database.ref('buddychats').child(sender).child(friend).push({
          sentby: sender,
          message: msg,
          //timestamp: firebase.database.ServerValue.TIMESTAMP
          timestamp: new Date().toLocaleString()
        }).then(() => {
            this.db.database.ref('buddychats').child(friend).child(sender).push({
                sentby: sender,
                message: msg,
                timestamp: new Date().toLocaleString()
                }).then(() => {
                    resolve(true);
                    })
            })
      })
      return promise;
    }
  }

  getbuddymessages(myUID:string,friendUID:string) {    
    let temp;    
    this.db.database.ref('buddychats').child(myUID).child(friendUID).on('value', (snapshot) => {
      this.buddymessages = [];
      temp = snapshot.val();
      for (var tempkey in temp) {
        this.buddymessages.push(temp[tempkey]);
      }
        this.events.publish('newmessage');
    });
  }
}
