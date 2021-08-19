import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-term-of-services',
  templateUrl: './term-of-services.page.html',
  styleUrls: ['./term-of-services.page.scss'],
})
export class TermOfServicesPage implements OnInit {

  constructor(public router: Router) { }

  ngOnInit() {
  }
  return() {
    this.router.navigate(['/']);
  }

}
