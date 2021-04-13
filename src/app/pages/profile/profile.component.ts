import { FirebaseService } from "src/app/services/firebase.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { AppService } from "src/app/services/app.service";
import { Router, ActivatedRoute } from "@angular/router";
import * as moment from "moment";
import { Subject } from "rxjs";
import * as _ from "lodash";
import { CommonService } from "src/app/services/common.service";
declare var google: any;
declare var $;

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"]
})
export class ProfileComponent implements OnInit {
  public user: IUser;
  public errorMessage = "";
  currentDate = window.moment();
  currentValue = this.currentDate.format("MMMM YYYY");
  isLoading: boolean = false;
  watchedVideos: IWatchedVideo[] = [];
  myPayments: IPayment[] = [];
  currentMonthPayment: IPayment;
  newPayment: IPayment = {};

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private appService: AppService,
    private srvFirebase: FirebaseService,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    let id = this.route.snapshot.queryParams.id;
    if (id != null && id != "" && this.appService.users.length > 0) {
      this.user = this.appService.users.filter((u: IUser) => {
        return u.email == id;
      })[0];
      this.myPayments =[];
    } else {
      this.router.navigateByUrl("home");
    }
  }
}
