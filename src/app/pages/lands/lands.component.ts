import { FirebaseService } from "src/app/services/firebase.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { AppService } from "src/app/services/app.service";
import { DataTableDirective } from "angular-datatables";
import { Router } from "@angular/router";
import * as firebase from "firebase";
import * as moment from "moment";
import { Subject } from "rxjs";
import * as _ from "lodash";
import { CommonService } from "src/app/services/common.service";
declare var $;

@Component({
  selector: "app-lands",
  templateUrl: "./lands.component.html",
  styleUrls: ["./lands.component.scss"]
})
export class LandsComponent implements OnInit {
  newLand: ILand = {};
  isUpdating: boolean = false;
  errorText: string = "";
  lands: ILand[] = [];
  landsDub: ILand[] = [];
  mylist: any = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective, { static: true })
  dtElement: DataTableDirective;

  constructor(
    private router: Router,
    private appService: AppService,
    private srvFirebase: FirebaseService,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.getlands();
  }

  ngAfterViewInit(): void {
    // console.log("landsComponent ngAfterViewInit")
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // console.log("landsComponent ngOnDestroy")
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance
      .then((dtInstance: DataTables.Api) => {
        // Destroy the table first
        dtInstance.destroy();
        // Call the dtTrigger to rerender again
        this.dtTrigger.next();
        // console.log("rerender")
      })
      .catch(error => {
        console.log(error);
      });
  }

  getlands() {
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 100,
      dom: "frtlip", //'frtlip',
      // order: [[6, 'asc']],
      processing: true,
      destroy: true,
      columnDefs: [
        { width: "5%", targets: 0, orderable: false },
        { width: "10%", targets: 1 },
        { width: "18%", targets: 2 },
        { width: "7%", targets: 3 },
        { width: "8%", targets: 4 },
        { width: "10%", targets: 5 }
      ]
    };
    // console.log("this.appService.lands: ", this.appService.lockerHistory);
    if (firebase.apps.length && this.appService.lands.length != 0) {
      this.lands = this.landsDub = _.sortBy(this.appService.lands, [
        function(o) {
          return moment(o.dateAdded).format();
        }
      ]).reverse();
    } else {
      this.srvFirebase
        .getAllLands()
        .then((lands: IUser[]) => {
          this.lands = this.landsDub = _.sortBy(this.appService.lands, [
            function(o) {
              return moment(o.dateAdded).format();
            }
          ]).reverse();
          this.rerender();
        })
        .catch(error => {
          console.log("Error Get lands ", error);
          this.appService.signOut();
        });
    }
  }

  deleteLand(land: ILand) {
    if (window.confirm('Are you sure you want to delete?')) {
      let index = _.findIndex(this.lands, ['id', land.id]);
      this.lands.splice(index, 1);
      this.appService.lands = this.lands;
      this.srvFirebase.deleteLand(land.id).then(() => {
        this.commonService.showSuccessMessage('Land deleted successfully');
      })
    }
  }
}
