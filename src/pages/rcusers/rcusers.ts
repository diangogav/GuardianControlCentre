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
  itemsArray;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public afDB: AngularFireDatabase,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController
  ) {
    this.initializeItems();
    }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad RcusersPage');
  }

    ionViewDidEnter(){
      this.items = firebase.database().ref('users').orderByKey();
              let toast = this.toastCtrl.create({
                  message: "Actualizando... ",
                  position: 'top',
                  dismissOnPageChange: true
                });

               toast.present();   
       
      this.items.once('value',(dataSnapshot) => {
            
          toast.dismiss();

          this.itemsArray = [];

          dataSnapshot.forEach((childSnapshot) => {

          this.itemsArray.push(childSnapshot.val());

         
        }); 
    })

  }

  initializeItems() {
    this.items;
  }

  getUsers(ev: any) { 
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.itemsArray = this.itemsArray.filter((itemsArray) => {
        return (itemsArray.name.toLowerCase().indexOf(val.toLowerCase()) > -1 ||          
            itemsArray.username.toLowerCase().indexOf(val.toLowerCase()) > -1 ||
            itemsArray.lastname.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  userPage(user){
    this.navCtrl.push(UserPage, { user: user });
  }
}
