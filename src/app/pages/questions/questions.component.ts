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

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit {
  newLand: ILand = {};
  isUpdating: boolean = false;
  errorText: string = "";
  questions: IQuestion[] = [];
  questionsDub: IQuestion[] = [];
  questionDetail: IQuestion = {}
  mylist: any = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective, { static: true })
  dtElement: DataTableDirective;
  fs: any;

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
      ]
    };
    // console.log("this.appService.lands: ", this.appService.lockerHistory);
    if (firebase.apps.length && this.appService.questions.length != 0) {
      this.questions = this.questionsDub = _.sortBy(this.appService.questions, [
        function(o) {
          return (o.title);
        }
      ]).reverse();
    } else {
      console.log("dont have")
      this.srvFirebase
        .getAllQuestions()
        .then((questions: IQuestion[]) => {
          this.questions = this.questionsDub = _.sortBy(questions, [
            function(o) {
              return (o.title);
            }
          ]).reverse();
          this.rerender();
        })
        .catch(error => {
          console.log("Error Get questions ", error);
          //this.appService.signOut();
        });
    }
  }
  getDetails(question){
    this.questionDetail = this.questions.find(ques=> ques == question)
  }

  deleteQuestion(question: IQuestion) {
    if (window.confirm('Are you sure you want to delete?')) {
      let index = _.findIndex(this.questions, ['id', question.id]);
      this.questions.splice(index, 1);
      this.appService.questions = this.questions;
      this.srvFirebase.deleteQuestion(question.id).then(() => {
        this.commonService.showSuccessMessage('Question deleted successfully');
      })
    }
  }

}
