import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import * as $ from 'jquery';

// import '././interfaces/interfaces';
import '../app/interfaces/interfaces';
import '../app/interfaces/window';

import { FirebaseService } from './services/firebase.service';
import *  as moment from "moment";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public isAuthenticated: boolean = false;
  constructor(
    private router: Router,
    private appService: AppService,
    private firebaseService: FirebaseService
  ) {

  }

  ngOnInit() {

    window.moment = moment;
    this.appService.isAuthenticated.subscribe((isAuthenticated: boolean) => {
      this.isAuthenticated = isAuthenticated;
    });

    this.router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        window.scroll(0, 0);
        let authenticated = Boolean(localStorage.getItem('isAuthenticated'));
        if (!authenticated || authenticated == undefined) {
          this.router.navigateByUrl('/login');
        }
      }
    });
 
    this.firebaseService.initializeApp();
    let authenticated = Boolean(localStorage.getItem('isAuthenticated'));
    if (authenticated) {
      this.isAuthenticated = true;
      
      this.router.navigateByUrl('/home');

    } else {
      this.router.navigateByUrl('/login');
    }
  }
}
