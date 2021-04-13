import { FirebaseService } from "src/app/services/firebase.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { AppService } from "src/app/services/app.service";
import { Router, ActivatedRoute } from "@angular/router";
import * as moment from "moment";
import { Subject } from "rxjs";
import * as _ from "lodash";
import { CommonService } from "src/app/services/common.service";
import { DataTableDirective } from "angular-datatables";

declare var google: any;
declare var $;

@Component({
  selector: "app-land-detail",
  templateUrl: "./land-detail.component.html",
  styleUrls: ["./land-detail.component.scss"]
})
export class LandDetailComponent implements OnInit {
  public land: ILand;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective, { static: true })
  dtElement: DataTableDirective;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private appService: AppService,
    private srvFirebase: FirebaseService,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    let id = this.route.snapshot.queryParams.id;
    if (id != null && id != "") {
      if (this.appService.lands.length > 0) {
        this.land = this.appService.lands.filter((u: ILand) => {
          return u.id == id;
        })[0];

        if (this.land.points && this.land.points.length == 0) {
          this.rerender();
        }
      } else {
        this.srvFirebase.getLandById(id).then(
          (land: ILand) => {
            this.land = land;
            this.rerender();
          },
          () => {
            this.router.navigateByUrl("home");
          }
        );
      }
    } else {
      this.router.navigateByUrl("home");
    }

    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 100,
      dom: "frtlip", //'frtlip',
      // order: [[6, 'asc']],
      processing: true,
      destroy: true,
      columnDefs: [
        { width: "5%", targets: 0 },
        { width: "10%", targets: 1 },
        { width: "15%", targets: 2 },
        { width: "10%", targets: 3 },
        { width: "10%", targets: 4 },
        { width: "10%", targets: 5 },
        { width: "20%", targets: 6 },
        { width: "15%", targets: 7 }
      ]
    };
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
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
        // //console.log("rerender")
      })
      .catch(error => {
        //console.log(error)
      });
  }

  deletePoint(point:ILandMarks){
    if (window.confirm("Are you sure you want to delete?")) {
      let index = _.findIndex(this.land.points, ["id", point.id]);
      if (index > -1) {
        this.land.points.splice(index, 1);
        this.srvFirebase.updateLand(this.land.id,{points:this.land.points}).then(() => {
          this.commonService.showSuccessMessage("Point deleted successfully");
        });
      }
    }
  }

}
