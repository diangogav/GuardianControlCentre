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

  u = [];
 
  constructor(public navCtrl: NavController, public navParams: NavParams) {
		this.u = navParams.data.user;
		console.log(this.u);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserPage');
  }

  usersBack(){
    this.navCtrl.push(RcusersPage);
  }

}
