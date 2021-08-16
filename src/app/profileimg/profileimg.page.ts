import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profileimg',
  templateUrl: './profileimg.page.html',
  styleUrls: ['./profileimg.page.scss'],
})
export class ProfileimgPage implements OnInit {

  constructor() {

  }
  ngOnInit() {
  }

  slides = [
    {image: "assets/imgs/img1.png"},
    {image: "assets/imgs/img1.png"},
    {image: "assets/imgs/img1.png"},
    {image: "assets/imgs/img1.png"},
    {image: "assets/imgs/img1.png"},
    {image: "assets/imgs/img1.png"},
    {image: "assets/imgs/img1.png"},
    {image: "assets/imgs/img1.png"}
  ];
}