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
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.scss"]
})
export class UsersComponent implements OnInit {
  newUser: IUser = {
    displayName: "",
    email: ""
  };
  isUpdating: boolean = false;
  errorText: string = "";
  users: IUser[] = [];
  usersDub: IUser[] = [];
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
    this.getUsers();
  }

  ngAfterViewInit(): void {
    // console.log("UsersComponent ngAfterViewInit")
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // console.log("UsersComponent ngOnDestroy")
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

  getUsers() {
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 100,
      dom: "frtlip", //'frtlip',
      // order: [[6, 'asc']],
      processing: true,
      destroy: true,
      columnDefs: [
        { width: "3%", targets: 0, orderable: false },
        { width: "12%", targets: 1 },
        { width: "13%", targets: 2 },
        { width: "13%", targets: 3 },
        { width: "8%", targets: 4 },
        { width: "10%", targets: 5 },
        { width: "15%", targets: 6 },
        { width: "15%", targets: 7 }
        // { width: "15%", targets: 8 }
      ]
    };
    // console.log("this.appService.users: ", this.appService.lockerHistory);
    if (firebase.apps.length && this.appService.users.length != 0) {
      this.users = this.usersDub = _.sortBy(this.appService.users, [
        function(o) {
          return moment(o.addedAt).format();
        }
      ]).reverse();
    } else {
      this.srvFirebase
        .getAllUsers()
        .then((users: IUser[]) => {
          this.users = this.usersDub = _.sortBy(this.appService.users, [
            function(o) {
              return moment(o.addedAt).format();
            }
          ]).reverse();
          this.rerender();
        })
        .catch(error => {
          console.log("Error Get Users ", error);
          this.appService.signOut();
        });
    }
  }

  updateUser(user: IUser) {
    this.newUser = _.cloneDeep(user);
    this.addDriverModalOpen();
  }

  addDriverModalOpen() {
    $("#addDriverModal").modal("toggle");
  }

  UpdateNow() {
    if (!this.newUser.displayName || $.trim(this.newUser.displayName).length == 0) {
      this.errorText = "Enter name of user";
    } else {
      this.isUpdating = true;
      this.srvFirebase.updateUser(this.newUser, this.newUser).then(
        customer => {
          // this.appService.drivers.push(customer);
          let index = _.findIndex(this.users, [
            "email",
            this.newUser.email
          ]);
          console.log("index: ", index);
          if (index > -1) {
            this.users[index] = customer;
          }
          this.isUpdating = false;
          this.commonService.showSuccessMessage("Driver updated successfully");
          this.newUser = {
            // name: "",
            // phoneNumber: "",
            // appVersion: ""
          };
          this.closeModal();
        },
        () => {
          this.isUpdating = false;
          this.commonService.APIErrorMessage();
        }
      );
    }
  }

  closeModal() {
    this.isUpdating = false;
    // this.newUser = {
    //   name: "",
    //   phoneNumber: "",
    //   appVersion: ""
    // };
    $("#addDriverModal").modal("toggle");
  }
}
