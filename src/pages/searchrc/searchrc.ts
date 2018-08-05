import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController } from 'ionic-angular';

import { DetailsrcPage } from '../detailsrc/detailsrc';
import firebase from 'firebase';
import { FirebaseDbProvider } from '../../providers/firebase-db/firebase-db';
 
/**
 * Generated class for the SearchrcPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-searchrc',
  templateUrl: 'searchrc.html',
})
export class SearchrcPage {

  markerArray: any[] = [];
  closure = [];
  countMarkersActual;
  referenceToOldestKey = '';

  constructor(

      public navCtrl: NavController, 
      public navParams: NavParams,
      public toastCtrl: ToastController,
      public dbFirebase :FirebaseDbProvider,

    )
   {


   }
/********************************************************************************** */

ionViewDidEnter(){
  

    this.getData();


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

getData(){



  if(this.referenceToOldestKey == undefined){


  }else if (!this.referenceToOldestKey) { // if initial fetch

    let toast = this.toastCtrl.create({
      message: "Actualizando... ",
      position: 'top',
      dismissOnPageChange: true
    });
  
   toast.present(); 
  
    firebase.database().ref('markers')
    .orderByKey()
    .limitToLast(20)
    .once('value')
    .then((snapshot) => {

      if(snapshot.val() == null){

        let toastNull = this.toastCtrl.create({
          message: "No hay accidentes registrados rescientemente",
          position: 'top',
          dismissOnPageChange: true,
          duration: 10000
        });

        toastNull.present();

      }else{

          // changing to reverse chronological order (latest first)
          let arrayOfKeys = Object.keys(snapshot.val())
            .sort()
            .reverse();
          // transforming to array
    
          let results = arrayOfKeys
            .map((key) => snapshot.val()[key]);
    
          // storing reference
          this.referenceToOldestKey = arrayOfKeys[arrayOfKeys.length-1];
    
          results.forEach(data => {
            this.markerArray.push(data);
          })
      }
      
        // Do what you want to do with the data, i.e.
        // append to page or dispatch({ … }) if using redux

        toast.dismiss();

     })
     .catch((error) => {  
      
    } );
   
   } else {

    firebase.database().ref('markers')
      .orderByKey()
      .endAt(this.referenceToOldestKey)
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
         this.referenceToOldestKey = arrayOfKeys[arrayOfKeys.length-1];
         // Do what you want to do with the data, i.e.
         // append to page or dispatch({ … }) if using redux
         results.forEach(data => {
          this.markerArray.push(data);
        });
      })
     .catch((error) => {  } );
   }
}

/********************************************************************************** */

  viewDetails(item){
     this.navCtrl.push(DetailsrcPage, { item: item });
  }

}

