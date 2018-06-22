import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,LoadingController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { SignupPage } from'../signup/signup';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  user = { 
    password: '', 
    email: ''
  };




  constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public auth: AuthProvider,
        public toastCtrl: ToastController,
        public loadingCtrl: LoadingController)
     {

     }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
  //CAMBIO DE PAGINA, REGISTRAR USUARIO
  signUp()
    {
        this.navCtrl.push(SignupPage);
    }

  login()
{
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    this.auth.loginUser(this.user.email,this.user.password ).then((user) => {
        loading.dismiss();
      }
    )
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
