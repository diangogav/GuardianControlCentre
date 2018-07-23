import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,LoadingController } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import {Observable} from 'rxjs/Observable';
import { UserPage } from '../user/user';
import firebase from 'firebase';
/**
 * Generated class for the RcusersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */ 

@IonicPage()
@Component({
  selector: 'page-rcusers',
  templateUrl: 'rcusers.html',
})
export class RcusersPage {
  
  items;
  usersArray: any[] = [];
  referenceToOldestUserKey = '';

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public afDB: AngularFireDatabase,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController
  ) {

    }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad RcusersPage');
  }

    ionViewDidEnter(){

      this.getData();
      
  }

  getData(){



    if(this.referenceToOldestUserKey == undefined){
  
      console.log("1" , this.referenceToOldestUserKey);
  
    }else if (!this.referenceToOldestUserKey) { // if initial fetch
      console.log("2" , this.referenceToOldestUserKey);
  
      let toast = this.toastCtrl.create({
        message: "Actualizando... ",
        position: 'top',
        dismissOnPageChange: true
      });
    
     toast.present(); 
  
      firebase.database().ref('users')
      .orderByKey()
      .limitToLast(20)
      .once('value')
      .then((snapshot) => { 
          // changing to reverse chronological order (latest first)
          let arrayOfKeys = Object.keys(snapshot.val())
             .sort()
             .reverse();
          // transforming to array
  
          let results = arrayOfKeys
             .map((key) => snapshot.val()[key]);
  
          // storing reference
          this.referenceToOldestUserKey = arrayOfKeys[arrayOfKeys.length-1];
  
          results.forEach(data => {
            this.usersArray.push(data);
          })
  
          // Do what you want to do with the data, i.e.
          // append to page or dispatch({ … }) if using redux
  
          toast.dismiss();
  
       })
       .catch((error) => {  } );
     
     } else {
  
      console.log("3" , this.referenceToOldestUserKey);
  
     
      firebase.database().ref('users')
        .orderByKey()
        .endAt(this.referenceToOldestUserKey)
        .limitToLast(20)
        .once('value')
        .then((snapshot) => {
          // changing to reverse chronological order (latest first)
          // & removing duplicate
          let arrayOfKeys = Object.keys(snapshot.val())
              .sort()
              .reverse()
              .slice(1);
  
  
           // transforming to array
           let results = arrayOfKeys
              .map((key) => snapshot.val()[key]);
  
           // updating reference
           this.referenceToOldestUserKey = arrayOfKeys[arrayOfKeys.length-1];
           // Do what you want to do with the data, i.e.
           // append to page or dispatch({ … }) if using redux
           results.forEach(data => {
            this.usersArray.push(data);
  
  
          });
        })
       .catch((error) => {  } );
     }
  }




/********************************************************************************** */

	//Infinite Scroll
	doInfinite(): Promise<any> {

    return new Promise((resolve) => {
      setTimeout(() => {

              this.getData();

        resolve();
      }, 500);
    })
 }

/********************************************************************************** */


  userPage(userData){

    this.navCtrl.push(UserPage, { userData: userData });
  }
}
