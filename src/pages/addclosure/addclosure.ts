import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController,ToastController,LoadingController } from 'ionic-angular';
import { FirebaseDbProvider } from '../../providers/firebase-db/firebase-db';
import { AuthProvider } from '../../providers/auth/auth';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Geolocation } from '@ionic-native/geolocation';
import { AddClosureValidators } from './../../validators/addClosure/addClosureValidators';

//PAGINAS
import { HomePage} from '../home/home';

@IonicPage()
@Component({
  selector: 'page-addclosure',
  templateUrl: 'addclosure.html',
})
export class AddclosurePage {

myphoto:any;
addClossureForm: FormGroup;
actualDate = new Date();
minDateForm;
latitude;
longitude;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public auth : AuthProvider,
    public fb: FormBuilder,
    public geo: Geolocation,
    public alertCtrl : AlertController,
    private camera: Camera,
    private dbFirebase :FirebaseDbProvider,
    public loadingCtrl : LoadingController,
    public toastCtrl : ToastController,


  ) {
    

    this.addClossureForm = this.fb.group({
      name: ['', [Validators.required,Validators.minLength(5), Validators.maxLength(20)]],
      closureType: ['', [Validators.required]],
      actualStartClosure: ['', [Validators.required,AddClosureValidators.checkDateActualStartClosure]],
      hour: ['', [Validators.required]],
      modeOfDetection: ['', [Validators.required]],
      motive: ['', [Validators.required]],
      durationHour: ['', [Validators.required]],
      durationMinutes: ['', [Validators.required]],
      latitude: ['', [Validators.required]],
      longitude: ['', [Validators.required]],
      
    });

 this.addClossureForm.get('actualStartClosure')
  .valueChanges
  .subscribe(value => {

    
    var date = this.addClossureForm.get('actualStartClosure').value;
    date = date.split('-');
    var day = date[2];

    if(day == this.actualDate.getDate()){

      const validators = [Validators.required, AddClosureValidators.checkHourActualStartClosure];
      this.addClossureForm.get('hour').setValidators(validators);
    }
    this.addClossureForm.updateValueAndValidity();
  });
  }

  saveData(){


    var expirationTime = this.calculatedExpirationDateMarker(
      this.addClossureForm.value.actualStartClosure,
      this.addClossureForm.value.hour,
      this.addClossureForm.value.durationHour,
      this.addClossureForm.value.durationMinutes
    )

    //alert(JSON.stringify(this.addClossureForm.value));

    var   marker = {
                    closureType: this.addClossureForm.value.closureType,
                    shortDescription: this.addClossureForm.value.name,
                    actualStartClosure: this.addClossureForm.value.actualStartClosure,
                    hour: this.addClossureForm.value.hour,
                    modeOfDetection: this.addClossureForm.value.modeOfDetection,
                    motive: this.addClossureForm.value.motive,
                    latitudAdded: this.addClossureForm.value.latitude,
                    longitudAdded: this.addClossureForm.value.longitude,
                    expirationTime: expirationTime.toLocaleTimeString(),
                    expirationDate: expirationTime.getFullYear() + '-' + ('0' + (expirationTime.getMonth() + 1)).slice(-2) + '-' + ('0' + expirationTime.getDate()).slice(-2),
                    status: "current"
                  } 

    //============================================================
        //Petición para guardar el marker en la database
        this.dbFirebase.saveMarker(marker)
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

  calculatedExpirationDateMarker(actualStartClosure,hour,durationHour,durationMinutes){

    var expirationTime = new Date();

    var valuesDate = actualStartClosure.split("-");
    var day = valuesDate[2];
    var month = valuesDate[1];
    var year = valuesDate[0];

    expirationTime.setDate(parseInt(day));
    expirationTime.setMonth(parseInt(month) - 1);
    expirationTime.setFullYear(parseInt(year));

    var valuesTime = hour.split(":");
    var hour = valuesTime[0];
    var minutes = valuesTime[1];

    var durationHour = durationHour;
    var durationMinutes = durationMinutes;

    expirationTime.setHours(parseInt(hour) + parseInt(durationHour));
    expirationTime.setMinutes(parseInt(minutes) + parseInt(durationMinutes));

    return expirationTime;

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
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    this.geo.getCurrentPosition().then ( pos => {


      this.latitude = pos.coords.latitude;
      this.longitude = pos.coords.longitude;

      loading.dismiss();

      let toast = this.toastCtrl.create({
        message: "Geolocalización Correcta!!",
        duration: 3000,
        position: 'top'
      });

     toast.present();   
 
    }).catch(err => {
      
      loading.dismiss();
      let toast = this.toastCtrl.create({
        message: "Error: " + err.message,
        duration: 3000,
        position: 'top'
      });

     toast.present();
    });
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
    


