import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  activeTab: number = 1;
  constructor(
    private router: Router,
    private appService: AppService,
    private zone: NgZone
  ) { }

  ngOnInit() {
  }

  navigate(url: string) {
    this.zone.run(() => {
      this.router.navigateByUrl(url);
    });
  }

  signOut() {
    this.appService.signOut();
  }
}
