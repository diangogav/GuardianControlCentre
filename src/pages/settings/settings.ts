
import { UpdatePage } from '../update/update';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController, App } from 'ionic-angular';
import {Observable} from 'rxjs/Observable';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import firebase from 'firebase';
import { AuthProvider } from '../../providers/auth/auth';
import { UserProvider } from '../../providers/user/user';
/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  user : any;
  items: Observable<any[]>;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public afDB: AngularFireDatabase,
    public auth: AuthProvider,
    public userProvider: UserProvider,
    public app: App,
    public loadingCtrl: LoadingController  
    ) {
      var userID = this.auth.getUser();
      this.user = firebase.database().ref('users/'+ userID).orderByKey();
      let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });

      loading.present();

      this.items = this.user.once('value',(snapshot) => {
      this.items =  snapshot.val();})
      
      loading.dismiss();
  }

  ionViewWillEnter() {
  
  }

    // CAMBIO DE PAGINA, ACTUALIZAR DATOS
    updata() {
      this.navCtrl.push(UpdatePage);
    }

    // SALIR DE LA SESION
    logOut() {
      const root = this.app.getRootNav();
      root.popToRoot();
    }


}
