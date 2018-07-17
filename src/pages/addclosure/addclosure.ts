import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import { FirebaseDbProvider } from '../../providers/firebase-db/firebase-db';
import { AuthProvider } from '../../providers/auth/auth';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { Geolocation } from '@ionic-native/geolocation';

//PAGINAS
import { HomePage} from '../home/home';

@IonicPage()
@Component({
  selector: 'page-addclosure',
  templateUrl: 'addclosure.html',
})
export class AddclosurePage {

myphoto:any;


 marker = {
  closureType: '',
  shortDescription: '',
  actualStartClosure:'',
  hour:'',
  modeOfDetection: '',
  moreDetails:'',
  aditionalInfo:'',
  motive:'',
  latitudPrev:'',
  longitudPrev:'',
  latitudAdded: 0,
  longitudAdded: 0,
  duration:'',
  expirationTime:'',
  expirationDate: ''

 } 



  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public auth : AuthProvider,
   // private apiProvider: ApiProvider,
    //private variablesProvider: GlobalVariablesProvider,
    public geo: Geolocation,
    public alertCtrl : AlertController,
    private camera: Camera,
    private dbFirebase :FirebaseDbProvider

  ) { 
  //VALOR POR DEFECTO SI NO FUNCIONA LA GEOLOCALIZACION

  }

  ionViewDidLoad() {}

  backPage()
    {
      this.navCtrl.push(HomePage);
    }




  ActivateGeolocation(){

    //========================================
    //========================================
    //GEOLOCATION IONIC NATIVE
    this.geo.getCurrentPosition().then ( pos => {

      this.marker.latitudAdded = pos.coords.latitude;
      this.marker.longitudAdded = pos.coords.longitude;
      alert("La latitud es: " +  this.marker.latitudAdded);
      alert("La longitud es: " + this.marker.longitudAdded);      

    }).catch( err => console.log(err));
  }

  addClosure(){
      

    //=========================================================
    //Calculo el tiempo de expiración del marker
    console.log(this.marker.actualStartClosure);
    var expirationTime = new Date();

    var valuesDate = this.marker.actualStartClosure.split("-");
    var day = valuesDate[2];
    var month = valuesDate[1];
    var year = valuesDate[0];

    expirationTime.setDate(parseInt(day));
    expirationTime.setMonth(parseInt(month) - 1);
    expirationTime.setFullYear(parseInt(year));

    var valuesTime = this.marker.hour.split(":");
    var hour = valuesTime[0];
    var minutes = valuesTime[1];

    expirationTime.setHours(parseInt(hour) + parseInt(this.marker.duration));
    expirationTime.setMinutes(parseInt(minutes));

    
    this.marker.expirationTime = expirationTime.toLocaleTimeString();
    this.marker.expirationDate = expirationTime.getFullYear() + '-' + ('0' + (expirationTime.getMonth() + 1)).slice(-2) + '-' + ('0' + expirationTime.getDate()).slice(-2);

    
    //============================================================
    //Petición para guardar el marker en la database
      this.dbFirebase.saveMarker(this.marker)
      .then(res=>{
        let alert = this.alertCtrl.create({
          title: 'Ok!',
          subTitle: 'Marker guardado correctamente',
          buttons: ['Aceptar']
        });
        alert.present();
      }).catch(err=>{
      let alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: err.message,
        buttons: ['Aceptar']
      });
      alert.present();
    })

  }

//====================================================================

//CAMARA FUNCION
takePhoto()
  {
      const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64:
     this.myphoto = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
     // Handle error
    });
  }

  pickPhoto()
  {
      const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum:false
    }

    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64:
     this.myphoto = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
     // Handle error
    });
  }
  
}
    


