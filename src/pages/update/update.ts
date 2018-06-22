import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController } from 'ionic-angular';
import {Observable} from 'rxjs/Observable';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import firebase from 'firebase';
import { AuthProvider } from '../../providers/auth/auth';
import { FirebaseDbProvider } from '../../providers/firebase-db/firebase-db';

import { HomePage } from '../home/home';
import { SettingsPage } from '../settings/settings';
/**
 * Generated class for the UpdatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-update',
  templateUrl: 'update.html',
})
export class UpdatePage {

  user : any;
  items: Observable<any[]>;
  
  userData = {
    name: '',
    lastname: '' ,
    username: '', 
    password: '',
    officePhone: '',
    mobilePhone: '',
    mobileUser: '',
    email: ''
  }
  



  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public afDB: AngularFireDatabase,
    public auth: AuthProvider,
    private dbFirebase: FirebaseDbProvider,
    public loadingCtrl: LoadingController

  ) {
      var userID = this.auth.getUser();
      this.user = firebase.database().ref('users/'+ userID).orderByKey();
      

    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

      this.items = this.user.once('value',(snapshot) => {
      this.items =  snapshot.val();
      this.userData = snapshot.val();

      loading.dismiss();
    })
      
  }
  ionViewDidEnter(){
    
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad UpdatePage');
  }

  updateUserData(){
        
     this.dbFirebase.updateUser(this.userData).then(res=>{
       console.log("Datos Actualizados")
     });
     this.navCtrl.push(HomePage);
   }

   settingsBack() {
      this.navCtrl.push(SettingsPage);
    }


}