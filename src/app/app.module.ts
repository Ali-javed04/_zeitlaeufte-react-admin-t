import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'
import * as firebase from 'firebase';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './coponents/header/header.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { UsersComponent } from './pages/users/users.component';
import { ProfileComponent } from './pages/profile/profile.component';

// import { environment } from 'src/environments/environment.prod';
import { HttpClientModule } from '@angular/common/http';
import { DataTablesModule } from 'angular-datatables';

import { LocalDatePipe } from 'src/app/pipes/local-date.pipe'
import { FromNowPipe } from 'src/app/pipes/from-now.pipe';
import { SurveyNamePipe } from 'src/app/pipes/survey-name.pipe';
import { LandsComponent } from './pages/lands/lands.component';
import { AddLandComponent } from './pages/add-land/add-land.component';
import { LandDetailComponent } from './pages/land-detail/land-detail.component';
import { AddNewPointComponent } from './pages/add-new-point/add-new-point.component'
import { SubstringPipe } from './pipes/substring.pipes';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    LoginComponent,
    UsersComponent,
    ProfileComponent,
    LocalDatePipe,
    FromNowPipe,
    SurveyNamePipe,
    SubstringPipe,
    LandsComponent,
    AddLandComponent,
    LandDetailComponent,
    AddNewPointComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    DataTablesModule,
    FormsModule,
    FroalaEditorModule.forRoot(),
     FroalaViewModule.forRoot() 
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
