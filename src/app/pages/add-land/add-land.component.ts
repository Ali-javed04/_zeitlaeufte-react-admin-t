import { Component, OnInit } from "@angular/core";
import { FirebaseService } from "src/app/services/firebase.service";
import { CommonService } from "src/app/services/common.service";
import { AppService } from "src/app/services/app.service";
import { ActivatedRoute } from "@angular/router";
import * as _ from "lodash";

@Component({
  selector: "app-add-land",
  templateUrl: "./add-land.component.html",
  styleUrls: ["./add-land.component.scss"]
})
export class AddLandComponent implements OnInit {
  uploadingText: string = "";
  localImages: string[] = [];
  newLand: ILand = {
    imageUrl: "",
    protectionType: "open"
  };

  isSaving?: boolean = false;
  editingLandId: string;
  public content: string = '';

  constructor(
    private firebaseService: FirebaseService,
    private commonService: CommonService,
    private appService: AppService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.editingLandId = this.route.snapshot.queryParams.editingLandId;
    if (this.editingLandId) {
      let index = _.findIndex(this.appService.lands, [
        "id",
        this.editingLandId
      ]);
      if (index > -1) {
        this.newLand = this.appService.lands[index];
        this.newLand.protectionType = this.newLand.protectionType ? this.newLand.protectionType : 'open';
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
  public imgOptions: Object = {
    angularIgnoreAttrs: ['style', 'ng-reflect-froala-editor', 'ng-reflect-froala-model'],
    immediateAngularModelUpdate: true,
    events: {
      "contentChanged": () => {
      }
    }
  }

  updateLand() {
    this.firebaseService.updateLand(this.editingLandId, this.newLand).then(
      () => {
        let index = _.findIndex(this.appService.lands, [
          "id",
          this.editingLandId
        ]);
        if (index > -1) {
          this.appService.lands[index] = this.newLand;
        }
        this.uploadingText = "";
        this.isSaving = false;
        this.commonService.showSuccessMessage("Land Updated successfully");
        this.localImages = [];
        this.newLand = {
          imageUrl: "",
          protectionType: "open"
        };
      },
      () => {
        this.uploadingText = "";
        this.isSaving = false;
        this.commonService.APIErrorMessage();
      }
    );
  }

  saveLand() {
    if ($.trim(this.newLand.title).length == 0) {
      this.commonService.showErrorMessage("Enter title of land");
    } else if ($.trim(this.newLand.description).length == 0) {
      this.commonService.showErrorMessage("Enter description of Land");
    } else if (this.localImages.length == 0 && !this.newLand.imageUrl) {
      this.commonService.showErrorMessage("Add image of Land");
    } else if (
      this.newLand.protectionType != "open" &&
      !this.newLand.passwordOrQrCode
    ) {
      this.commonService.showErrorMessage(
        this.newLand.protectionType == "password"
          ? "Please enter password"
          : "Please enter QR code string"
      );
    } else {
      this.isSaving = true;
      this.uploadImages().then(() => {
        this.uploadingText = "Saving Land data";
        if (this.editingLandId) {
          this.updateLand();
          return;
        }
        this.firebaseService.addNewLand(this.newLand).then(
          (land: ILand) => {
            this.uploadingText = '';
            this.appService.lands.push(land);
            this.isSaving = false;
            this.commonService.showSuccessMessage("Land saved successfully");
            this.localImages = [];
            this.newLand = {
              imageUrl: null,
              protectionType: "open"
            };
          },
          () => {
            this.uploadingText = '';
            this.isSaving = false;
            this.commonService.APIErrorMessage();
          }
        );
      });
    }
  }

  uploadImages() {
    return new Promise((resolve, reject) => {
      if (this.localImages.length) {
        this.commonService.asyncLoop(
          this.localImages.length,
          loop => {
            let i = loop.iteration();
            this.uploadingText = `Uploading ${i + 1} of ${
              this.localImages.length
            } images`;
            this.firebaseService
              .uploadImageToFirebase(this.localImages[i],(percentage: IUploadedProgress)=>{
                this.uploadingText = `Uploading image ${percentage.progress}%`;
              })
              .then((url: string) => {
                this.newLand.imageUrl = url;
                loop.next();
              });
          },
          () => {
            this.uploadingText = "";
            resolve('1');
          }
        );
      } else {
        resolve('1');
      }
    });
  }

  removeUploadedImg(index) {
    this.newLand.imageUrl = null;
  }

  removeImg(index) {
    this.localImages.splice(index, 1);
  }
}
