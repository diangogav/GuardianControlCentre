import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,LoadingController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { LoginPage } from '../login/login';
import { FirebaseDbProvider } from '../../providers/firebase-db/firebase-db';
/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  user = {     
    password: '', 
    email: ''
  }

  personalData = {
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
    public auth : AuthProvider,
    public loadingCtrl : LoadingController,
    public toastCtrl : ToastController,
    private dbFirebase :FirebaseDbProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }
 /* CAMBIO DE PAGINA LOGIN PAGE */
  login(){
    this.navCtrl.push(LoginPage);
  }

  addUser(){
    let loading = this.loadingCtrl.create({
            content: 'Please wait...'
    });

    loading.present();
    
    this.auth.registerUser(this.user.email,this.user.password)
    .then((user) => {
      this.dbFirebase.saveUser(this.personalData).then(res=>{
           loading.dismiss();
           let toast = this.toastCtrl.create({
                message: "Se ha registrado correctamente",
                duration: 3000,
                position: 'top'
              });

             toast.present();        

      })
    })
    .catch(err=>{
              loading.dismiss();     
              let toast = this.toastCtrl.create({
                message: err,
                duration: 3000,
                position: 'top'
              });

             toast.present();   
    })

  }

}
