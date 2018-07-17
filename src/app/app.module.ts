import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { SignupPage } from '../pages/signup/signup';
import { LoginPage } from '../pages/login/login';
import { AddclosurePage } from '../pages/addclosure/addclosure';
import { RcusersPage } from '../pages/rcusers/rcusers';
import { SettingsPage } from '../pages/settings/settings';
import { UpdatePage } from '../pages/update/update';
import { UserPage } from '../pages/user/user';
import { SearchrcPage } from '../pages/searchrc/searchrc';
import { DetailsrcPage } from '../pages/detailsrc/detailsrc';



import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthProvider } from '../providers/auth/auth';
import { FirebaseDbProvider } from '../providers/firebase-db/firebase-db';
import { Geolocation } from '@ionic-native/geolocation';
import { UserProvider } from '../providers/user/user';

import { IonicImageViewerModule } from 'ionic-img-viewer';
import { Camera } from '@ionic-native/camera';

export const firebaseConfig = {
  apiKey: "AIzaSyBJpDGocfQ5yOTUYC1j5pAk3F0duwT4Now",
  authDomain: "guardiancontrolcentre-249f9.firebaseapp.com",
  databaseURL: "https://guardiancontrolcentre-249f9.firebaseio.com",
  projectId: "guardiancontrolcentre-249f9",
  storageBucket: "guardiancontrolcentre-249f9.appspot.com",
  messagingSenderId: "397134959533"
};

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    SignupPage,
    LoginPage,
    AddclosurePage,
    RcusersPage,
    SettingsPage,
    UpdatePage,
    UserPage,
    SearchrcPage,
    DetailsrcPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    IonicImageViewerModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    SignupPage,
    LoginPage,
    AddclosurePage,
    RcusersPage,
    SettingsPage,
    UpdatePage,
    UserPage,
    SearchrcPage,
    DetailsrcPage
  ],
  providers: [
    StatusBar,
    SplashScreen, Camera,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    FirebaseDbProvider,
    UserProvider
  ]
})
export class AppModule {}
