import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.page.html',
  styleUrls: ['./sidemenu.page.scss'],
})
export class SidemenuPage implements OnInit {
rootPage:any;
  constructor() { }

  ngOnInit() {
  }


  itemClick(component){
       this.rootPage = component;
  }


}
