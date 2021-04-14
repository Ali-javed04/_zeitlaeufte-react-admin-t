import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./pages/home/home.component";
import { LoginComponent } from "./pages/login/login.component";
import { UsersComponent } from "./pages/users/users.component";
import { ProfileComponent } from "./pages/profile/profile.component";
import { LandsComponent } from "./pages/lands/lands.component";
import { AddLandComponent } from './pages/add-land/add-land.component';
import { LandDetailComponent } from './pages/land-detail/land-detail.component';
import { AddNewPointComponent } from './pages/add-new-point/add-new-point.component';
import { AddQuestionComponent } from "./pages/add-question/add-question.component";
import { QuestionsComponent } from "./pages/questions/questions.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full"
  },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "home",
    component: HomeComponent
  },
  {
    path: "users",
    component: UsersComponent
  },
  {
    path: "profile",
    component: ProfileComponent
  },

  {
    path: "lands",
    component: LandsComponent
  },
  {
    path: "add-lands",
    component: AddLandComponent
  },
  {
    path: "land-detail",
    component: LandDetailComponent
  },
  {
    path: "add-new-point",
    component: AddNewPointComponent
  },
  {
    path: "add-question",
    component: AddQuestionComponent
  },
  {
    path: "questions",
    component: QuestionsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
