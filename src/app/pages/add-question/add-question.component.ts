import { Component, OnInit } from "@angular/core";
import { FirebaseService } from "src/app/services/firebase.service";
import { CommonService } from "src/app/services/common.service";
import { AppService } from "src/app/services/app.service";
import { ActivatedRoute } from "@angular/router";
import * as _ from "lodash";

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.scss']
})
export class AddQuestionComponent implements OnInit {
  uploadingText: string = "";
  localImages: string[] = [];
  newQuestion: IQuestion = {
    options: []
  };

  isSaving?: boolean = false;
  editingQuestionId: string;
  fs: any;

  constructor(
    private firebaseService: FirebaseService,
    private commonService: CommonService,
    private appService: AppService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.editingQuestionId = this.route.snapshot.queryParams.editingQuestionId;
    console.log("editing")
    if (this.editingQuestionId, this.editingQuestionId) {
      console.log("editing true", this.editingQuestionId)
      let index = _.findIndex(this.appService.questions, [
        "id",
        this.editingQuestionId
      ]);
      if (index > -1) {
        this.newQuestion = this.appService.questions[index];
      }
    }

    $(document).ready(() => {
      $("#productaddimage").change((e: any) => {
        if (e && e.target && e.target.files) {
          for (var i = 0; i < e.target.files.length; i++) {
            this.commonService
              .getBase64(e.target.files[i])
              .then((base64: string) => {
                this.localImages.push(base64);
              });
          }
        }
      });
    });
  }

  updateQuestion() {
    this.firebaseService.updateLand(this.editingQuestionId, this.newQuestion).then(
      () => {
        let index = _.findIndex(this.appService.lands, [
          "id",
          this.editingQuestionId
        ]);
        if (index > -1) {
          this.appService.lands[index] = this.newQuestion;
        }
        this.uploadingText = "";
        this.isSaving = false;
        this.commonService.showSuccessMessage("Land Updated successfully");
        this.localImages = [];
        this.newQuestion = {
        };
      },
      () => {
        this.uploadingText = "";
        this.isSaving = false;
        this.commonService.APIErrorMessage();
      }
    );
  }

  saveQuestion() {
    if ($.trim(this.newQuestion.title).length == 0) {
      this.commonService.showErrorMessage("Enter title of Question");
    } else if ((this.newQuestion.options).length < 2) {
      this.commonService.showErrorMessage("Enter options for Question");
    } else if (
      this.newQuestion.answer == undefined
    ) {
      this.commonService.showErrorMessage("Enter answer of Question");
    } else {
      this.isSaving = true;
      this.uploadingText = "Saving Question data";
      if (this.editingQuestionId) {
        this.updateQuestion();
        return;
      }
      this.firebaseService.addNewQuestion(this.newQuestion).then(
        (question: IQuestion) => {
          this.uploadingText = '';
          this.appService.questions.push(question);
          this.isSaving = false;
          this.commonService.showSuccessMessage("Question saved successfully");
          this.newQuestion = { options: []
          };
        },
        () => {
          this.uploadingText = '';
          this.isSaving = false;
          this.commonService.APIErrorMessage();
        }
      );
    }
  }

  addOption(option){
    if(this.newQuestion.options.length > 3 ){
      this.commonService.showErrorMessage("only 4 options allowed")
      return
    }
    this.newQuestion.options.push(option)
  }

  removeOption(i){
    this.newQuestion.options.splice(i,1)
  }

  changeStyle(num) {
    this.fs = num
  }

}
