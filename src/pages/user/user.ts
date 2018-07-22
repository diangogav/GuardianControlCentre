import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RcusersPage } from '../rcusers/rcusers';

/**
 * Generated class for the UserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
})
export class UserPage {

  userData;
 
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.userData = navParams.data.userData;   
  }
 
 

}
