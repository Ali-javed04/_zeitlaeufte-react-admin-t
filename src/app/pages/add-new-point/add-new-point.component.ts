import { Component, OnInit } from "@angular/core";
import { FirebaseService } from "src/app/services/firebase.service";
import { CommonService } from "src/app/services/common.service";
import { AppService } from "src/app/services/app.service";
import { ActivatedRoute } from "@angular/router";
import * as _ from "lodash";

@Component({
  selector: "app-add-new-point",
  templateUrl: "./add-new-point.component.html",
  styleUrls: ["./add-new-point.component.scss"]
})
export class AddNewPointComponent implements OnInit {
  uploadingText: string = "";
  localImage: string;
  localAudio: string;
  localVideo: string;
  landId: string;
  newPoint: ILandMarks = {
    backgroundColor: "#ffffff",
    titleColor: "#ff0000"
  };

  isSaving?: boolean = false;
  editingPointId: string;

  constructor(
    private firebaseService: FirebaseService,
    private commonService: CommonService,
    private appService: AppService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.editingPointId = this.route.snapshot.queryParams.editingPointId;
    this.landId = this.route.snapshot.queryParams.landId;
    console.log("landId: ", this.landId);
    console.log("this.editingPointId: ", this.editingPointId);
    if (this.editingPointId) {
      let index = _.findIndex(this.appService.lands, ["id", this.landId]);
      if (index > -1) {
        let pIndex = _.findIndex(this.appService.lands[index].points, [
          "id",
          this.editingPointId
        ]);
        this.newPoint = this.appService.lands[index].points[pIndex];
      } else {
        this.firebaseService.getLandById(this.landId).then((land: ILand) => {
          let pIndex = _.findIndex(land.points, ["id", this.editingPointId]);
          this.newPoint = land.points[pIndex];
        });
      }
    }
    

    setTimeout(() => {
      $(document).ready(() => {
        $("#productaddimage").change((e: any) => {
          if (e && e.target && e.target.files) {
            for (var i = 0; i < e.target.files.length; i++) {
              this.commonService
                .getBase64(e.target.files[i])
                .then((base64: string) => {
                  this.localImage = base64;
                });
            }
          }
        });
      });

      $("#productaddAudio").change((e: any) => {
        if (e && e.target && e.target.files) {
          for (var i = 0; i < e.target.files.length; i++) {
            this.commonService
              .getBase64(e.target.files[i])
              .then((base64: string) => {
                console.log("local audios: ", base64);
                this.localAudio = base64;
              });
          }
        }
      });

      $("#productaddVideo").change((e: any) => {
        if (e && e.target && e.target.files) {
          for (var i = 0; i < e.target.files.length; i++) {
            this.commonService
              .getBase64(e.target.files[i])
              .then((base64: string) => {
                console.log("local audios: ", base64);
                this.localVideo = base64;
              });
          }
        }
      });
    }, 1000);
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
    let index = _.findIndex(this.appService.lands, ["id", this.landId]);
    console.log("land index:  ", index);
    let land: ILand = this.appService.lands[index];
    land.points = land.points || [];
    let pIndex = _.findIndex(land.points, ["id", this.editingPointId]);
    console.log("point index:  ", pIndex);
    land.points[pIndex < 0 ? 0 : pIndex] = this.newPoint;
    this.appService.lands[index] = land;
    this.firebaseService.updateLand(this.landId, { points: land.points }).then(
      () => {
        this.isSaving = false;
        this.commonService.showSuccessMessage(
          "Land Point Updated successfully"
        );
        this.localAudio = "";
        this.localImage = "";
        this.localVideo = "";
        this.newPoint = {
          backgroundColor: "#ffffff",
          titleColor: "#ff0000",
          imageURL: "",
          videoURL: "",
          audioURL: ""
        };
      },
      () => {
        this.isSaving = false;
        this.commonService.APIErrorMessage();
      }
    );
  }

  savePoint() {
    if (!this.newPoint.indexPosition) {
      this.commonService.showErrorMessage("Enter Chapter number of point");
    } else if ($.trim(this.newPoint.name).length == 0) {
      this.commonService.showErrorMessage("Enter name of point");
    } else {
      this.isSaving = true;
      this.uploadImages().then(() => {
        this.uploadAudio().then(() => {
          this.uploadVideo().then(() => {
            if (this.editingPointId) {
              this.updateLand();
              return;
            }
            let index = _.findIndex(this.appService.lands, ["id", this.landId]);
            console.log("points: ", index);
            if (index > -1) {
              this.proceed(this.appService.lands[index]);
            } else {
              this.firebaseService
                .getLandById(this.landId)
                .then((land: ILand) => {
                  this.proceed(land);
                });
            }
          });
        });
      });
    }
  }

  proceed(land: ILand) {
    let bg: any = $("#bgcolor").val();
    let tc: any = $("#tcolor").val();
    this.newPoint.backgroundColor = bg;
    this.newPoint.titleColor = tc;
    console.log("this.newPoint: ", this.newPoint);
    land.points = land.points || [];
    this.newPoint.id = "id-" + this.commonService.getTimeStamp();
    this.newPoint.dateAdded = window.moment().format("llll");
    land.points.push(this.newPoint);
    let index = _.findIndex(this.appService.lands, ["id", land.id]);
    this.appService.lands[index] = land;
    this.firebaseService.updateLand(this.landId, { points: land.points }).then(
      () => {
        this.isSaving = false;
        this.commonService.showSuccessMessage("Land Point saved successfully");
        this.localAudio = "";
        this.localImage = "";
        this.localVideo = "";
        this.newPoint = {
          backgroundColor: "#ffffff",
          titleColor: "#ff0000",
          imageURL: "",
          videoURL: "",
          audioURL: ""
        };
      },
      () => {
        this.isSaving = false;
        this.commonService.APIErrorMessage();
      }
    );
  }

  // Audio
  uploadAudio() {
    return new Promise((resolve, reject) => {
      if (this.localAudio) {
        this.firebaseService
          .uploadAudioToFirebase(
            this.localAudio,
            (percentage: IUploadedProgress) => {
              this.uploadingText = `uploading audio ${percentage.progress}%`;
            }
          )
          .then((url: string) => {
            this.uploadingText = "";
            this.newPoint.audioURL = url;
            resolve('1');
          });
      } else {
        resolve('1');
      }
    });
  }

  removeAudio() {
    this.localAudio = null;
  }

  removeUploadedAudio() {
    this.newPoint.audioURL = null;
  }

  // Image
  uploadImages() {
    return new Promise((resolve, reject) => {
      if (this.localImage) {
        this.uploadingText = `Uploading image`;
        this.firebaseService
          .uploadImageToFirebase(
            this.localImage,
            (percentage: IUploadedProgress) => {
              this.uploadingText = `Uploading image ${percentage.progress}%`;
            }
          )
          .then((url: string) => {
            this.newPoint.imageURL = url;
            resolve('1');
          });
      } else {
        resolve('1');
      }
    });
  }

  removeUploadedImg() {
    this.newPoint.imageURL = null;
  }

  removeImg() {
    this.localImage = null;
  }

  // Video

  uploadVideo() {
    return new Promise((resolve, reject) => {
      if (this.localVideo) {
        this.firebaseService
          .uploadVideoToFirebase(
            this.localVideo,
            (percentage: IUploadedProgress) => {
              this.uploadingText = `uploading video ${percentage.progress}%`;
            }
          )
          .then((url: string) => {
            this.uploadingText = "";
            this.newPoint.videoURL = url;
            resolve('1');
          });
      } else {
        resolve('1');
      }
    });
  }

  removeUploadedVideos() {
    this.newPoint.videoURL = null;
  }

  removeVideos() {
    this.localVideo = null;
  }
}
