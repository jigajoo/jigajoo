import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFireDatabase } from '@angular/fire/database';
import { Events } from '../../app/services/events.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
buddy: any;
  buddymessages = [];
  constructor(public db: AngularFireDatabase,
    private afauth: AngularFireAuth, public events : Events) { }

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
    console.log(myUID+'this.buddymessages'+friendUID,this.buddymessages);
    this.db.database.ref('buddychats').child(myUID).child(friendUID).on('value', (snapshot) => {
      console.log('this.buddymessages',snapshot);
      this.buddymessages = [];
      temp = snapshot.val();
      for (var tempkey in temp) {
        this.buddymessages.push(temp[tempkey]);
      }
      console.log('this.buddymessages',this.buddymessages);
        this.events.publish('newmessage');
    });
  }
}
