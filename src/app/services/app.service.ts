import { Injectable, EventEmitter } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class AppService {
  public isAuthenticated: EventEmitter<boolean> = new EventEmitter();
  public user: EventEmitter<any> = new EventEmitter();
  public users: IUser[] = [];
  public lands: ILand[] = [];
  public questions: IQuestion[] = [];

  constructor(private router: Router) {}

  signOut() {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("authToken");
    this.isAuthenticated.emit(false);
    this.router.navigateByUrl("/login");
  }
}
