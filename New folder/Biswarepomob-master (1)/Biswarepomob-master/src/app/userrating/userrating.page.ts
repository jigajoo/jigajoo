import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ToastController } from "@ionic/angular";

@Component({
  selector: 'app-userrating',
  templateUrl: './userrating.page.html',
  styleUrls: ['./userrating.page.scss'],
})
export class UserratingPage implements OnInit {

  constructor(public http: HttpClient, public router: Router, private route: ActivatedRoute, private toast: ToastController) { }

  ngOnInit() {
  }

  back() {
    this.router.navigate(['/'])
  }

}
