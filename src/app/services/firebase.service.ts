import { Injectable } from "@angular/core";
import * as firebase from "firebase";
import * as _ from "lodash";
import * as moment from "moment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AppService } from "src/app/services/app.service";
import { CommonService } from "./common.service";

@Injectable({
  providedIn: "root"
})
export class FirebaseService {
  // firestore = firebase;

  constructor(
    private appService: AppService,
    private http: HttpClient,
    private commonServie: CommonService
  ) {}

  initializeApp() {
    var firebaseConfig = {
      apiKey: "AIzaSyD8PsHEel_gbhFF5S-4OOuhTJwUBU0WoaM",
      authDomain: "zeitlaeufte-53e1d.firebaseapp.com",
      databaseURL: "https://zeitlaeufte-53e1d.firebaseio.com",
      projectId: "zeitlaeufte-53e1d",
      storageBucket: "zeitlaeufte-53e1d.appspot.com",
      messagingSenderId: "14512457436",
      appId: "1:14512457436:web:b2532d9ea4085a39f11619",
      measurementId: "G-Y22P63LGLP"
    };
    firebase.initializeApp(firebaseConfig);
  }

  getApiKey() {
    return new Promise((resolve, reject) => {
      //resolve();
    });
  }

  getAllUsers() {
    let _users: IUser[] = [];
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection("users")
        .get()
        .then(
          users => {
            if (users.size) {
              users.forEach(user => {
                user.data().registeredDate = moment(
                  user.data().registeredDate
                ).format();
                _users.push(user.data());
              });
              this.appService.users = _users;
              resolve(_users);
            } else {
              resolve(_users);
            }
          },
          err => {
            reject(_users);
          }
        );
    });
  }

  updateUser(user: IUser, prop: object) {
    return new Promise((resolve, reject) => {
      user.lastUpdate = window.moment().format("llll");
      firebase
        .firestore()
        .collection("users")
        .doc(user.email)
        .update(prop)
        .then(
          resp => {
            resolve(user);
          },
          err => {
            console.log(`[Firebase==>updateCustomer]: ${err}`);
            resolve(alert);
          }
        );
    });
  }

  //#region Lands

  getAllLands() {
    let lands: ILand[] = [];
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection("lands")
        .get()
        .then(
          records => {
            if (records.size) {
              records.forEach(record => {
                lands.push(record.data());
              });
              this.appService.lands = lands;
              resolve(lands);
            } else {
              resolve(lands);
            }
          },
          err => {
            reject(lands);
          }
        );
    });
  }

  getAllQuestions() {
    console.log("server ")
    let questions: any[] = [];
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection("questions")
        .get()
        .then(
          records => {
            if (records.size) {
              records.forEach(record => {
                console.log("got record ", record.data())
                questions.push(record.data());
              });
              this.appService.questions = questions;
              resolve(questions);
            } else {
              resolve(questions);
            }
          },
          err => {
            console.log("erroror ", err)
            reject(questions);
          }
        );
    });
  }

  getLandById(id:string) {
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection("lands")
        .doc(id)
        .get()
        .then(
          records => {
              resolve(records.data());
          },
          err => {
            reject();
          }
        );
    });
  }

  addNewLand(land: ILand) {
    land.dateAdded = window.moment().format("llll");
    land.id = `id-${this.commonServie.getTimeStamp()}`;
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection("lands")
        .doc(land.id)
        .set(land)
        .then(
          () => {
            resolve(land);
          },
          err => {
            resolve(land);
          }
        );
    });
  }

  addNewQuestion(question: IQuestion) {
    question.id = `id-${this.commonServie.getTimeStamp()}`;
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection("questions")
        .doc(question.id)
        .set(question)
        .then(
          () => {
            resolve(question);
          },
          err => {
            resolve(question);
          }
        );
    });
  }

  updateLand(id: string, props: any) {
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection("lands")
        .doc(id)
        .update(props)
        .then(
          () => {
            resolve(id);
          },
          err => {
            resolve(id);
          }
        );
    });
  }
  
  deleteLand(id: string) {
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection("lands")
        .doc(id)
        .delete()
        .then(
          resp => {
            resolve(id);
          },
          err => {
            console.log(`[Firebase==>products delete]: ${err}`);
            reject(err);
          }
        );
    });
  }
  
  deleteQuestion(id: string) {
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection("questions")
        .doc(id)
        .delete()
        .then(
          resp => {
            resolve(id);
          },
          err => {
            console.log(`[Firebase==>products delete]: ${err}`);
            reject(err);
          }
        );
    });
  }

  //#endregion lands

  uploadImageToFirebase(base64: string, progressCallback?: any) {
    return new Promise((resolve, reject) => {
      const filename = Math.floor(Date.now() / 1000);
      var storageRef: any = firebase.storage().ref().child(`audios` + filename);
      const uploadTask = storageRef.putString(base64, 'data_url');
      uploadTask.on("state_changed", (snapshot) => {
        var progress = parseInt(((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toString());
        console.log('i am here 5: ', progress);
        if (progressCallback) {
          progressCallback({
            bytesTransferred: snapshot.bytesTransferred,
            totalBytes: snapshot.totalBytes,
            progress
          })
        };
      }, (err) => {
        console.log('erron upload: ', err);
        reject(err);
      }, () => {
        // on complete
        uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
          resolve(downloadURL);
        });
      });
    });
  }


  uploadAudioToFirebase(base64: string, progressCallback?: any) {
    return new Promise((resolve, reject) => {
      const filename = Math.floor(Date.now() / 1000);
      var storageRef: any = firebase.storage().ref().child(`audios` + filename);
      const uploadTask = storageRef.putString(base64, 'data_url');
      uploadTask.on("state_changed", (snapshot) => {
        var progress = parseInt(((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toString());
        console.log('i am here 5: ', progress);
        if (progressCallback) {
          progressCallback({
            bytesTransferred: snapshot.bytesTransferred,
            totalBytes: snapshot.totalBytes,
            progress
          })
        };
      }, (err) => {
        console.log('erron upload: ', err);
        reject(err);
      }, () => {
        // on complete
        uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
          resolve(downloadURL);
        });
      });
    });
  }

  uploadVideoToFirebase(base64: string, progressCallback?: any) {
    return new Promise((resolve, reject) => {
      const filename = Math.floor(Date.now() / 1000);
      var storageRef: any = firebase
        .storage()
        .ref()
        .child(`videos-` + filename);
      const uploadTask = storageRef.putString(base64, "data_url");
      uploadTask.on(
        "state_changed",
        snapshot => {
          var progress = parseInt(
            ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toString()
          );
          console.log("i am here 5: ", progress);
          if (progressCallback) {
            progressCallback({
              bytesTransferred: snapshot.bytesTransferred,
              totalBytes: snapshot.totalBytes,
              progress
            });
          }
        },
        err => {
          console.log("erron upload: ", err);
          reject(err);
        },
        () => {
          // on complete
          uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            resolve(downloadURL);
          });
        }
      );
    });
  }

}
