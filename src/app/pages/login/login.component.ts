import { FirebaseService } from 'src/app/services/firebase.service';
import { AppService } from 'src/app/services/app.service';
import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
declare var $;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  // root@zeitlaeufte.com
  // admin12345
  userAuth: any = {
    email: "",
    password: ""
  };
  uid: string = '';
  constructor(
    private srvFirebase: FirebaseService,
    private appService: AppService,
    private router: Router,
    private zone: NgZone

  ) { }

  ngOnInit() {
    this.uid = localStorage.getItem("authToken");
    if (this.uid != '' && this.uid != null) this.router.navigateByUrl('/home');
  }

  signIn() {
    $(".submit-button").prop('disabled', true);
    let valid = this.isValid();
    if (valid) {
      if (this.userAuth.email == "root@zeitlaeufte.com") {
        firebase.auth().signInWithEmailAndPassword(this.userAuth.email, this.userAuth.password)
          .then(resp => {
            console.log('resp of auth: ', resp);
            this.appService.isAuthenticated.emit(true);
            localStorage.setItem("isAuthenticated", 'true');
            this.zone.run(() => {
              this.router.navigateByUrl('/home');
              setTimeout(()=>{
                window.location.reload();
              })
            });
          }, error => {
            console.log(error);
            $.notify({ message: 'Incorrect Crediential' }, { type: 'danger' });
            // alert("Incorrect Crediential!");
            $(".submit-button").prop('disabled', false);
          });
      }
      else {
        $.notify({ message: 'Incorrect Crediential' }, { type: 'danger' });
        $(".submit-button").prop('disabled', false);
      }
    } else {
      $(".submit-button").prop('disabled', false);
    }
  }

  isValid() {
    if (this.userAuth.email == undefined) {
      $.notify({ message: 'Please Enter Email' }, { type: 'danger' });
      // alert("Please enter email");
      return false;
    } else if (this.userAuth.password == undefined) {
      $.notify({ message: 'Please Enter Password' }, { type: 'danger' });
      // alert("Please enter password");
      return false;
    }
    return true;
  }

}
