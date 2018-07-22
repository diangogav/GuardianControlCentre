import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController } from 'ionic-angular';

import { DetailsrcPage } from '../detailsrc/detailsrc';
import firebase from 'firebase';

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

  items;
  markerArray: any[] = [];
  closure = [];

  constructor(
      public navCtrl: NavController, 
      public navParams: NavParams,
      public toastCtrl: ToastController
    )
   {

      this.initializeItems();

   }

ionViewDidEnter(){

    this.items = firebase.database().ref('markers').orderByKey();
    let toast = this.toastCtrl.create({
        message: "Actualizando... ",
        position: 'top',
        dismissOnPageChange: true
  });

    toast.present();   

  this.items.on('value',(snapshot) => {
    this.markerArray.splice(0,this.markerArray.length);
    snapshot.forEach((childSnapshot) => {
      this.markerArray.push(childSnapshot.val());
    });
    this.markerArray.forEach(data => {
      console.log(data.shortDescription);
    })
    toast.dismiss();
  }); 

}

  initializeItems() {
    this.closure = [
      {
        'nombre' : 'Calle averiada',
        'descripcion' : 'La calle no esta afaltada',
        'location' : 'Calle Zamora 8899',
        'hora' : '3:00 PM',
        'fecha' : '28/03/2018',
        'status' : 'Current'
      },
      {
        'nombre' : 'Trafico',
        'descripcion' : 'Mucho tracico en la carretera principal',
        'location' : 'Autopista Derechos',
        'hora' : '5:49 PM',
        'fecha' : '28/03/2018',
        'status' : 'Current'
      },
      {
        'nombre' : 'Accidente',
        'descripcion' : 'Arraollamiento en la via',
        'location' : 'Avenida Dos Caminos',
        'hora' : '6:40 PM',
        'fecha' : '28/03/2018',
        'status' : 'Current'
      },
      {
        'nombre' : 'Sin paso en la via',
        'descripcion' : 'Calle cerrada temparmente',
        'location' : 'Avenida Dos Caminos',
        'hora' : '8:40 AM',
        'fecha' : '20/05/2018',
        'status' : 'Current'
      }
    ];

    this.items = this.closure;
  }


    getItems(ev: any) { 
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.items = this.items.filter((items) => {
        return (items.nombre.toLowerCase().indexOf(val.toLowerCase()) > -1 ||
            items.descripcion.toLowerCase().indexOf(val.toLowerCase()) > -1 ||
            items.location.toLowerCase().indexOf(val.toLowerCase()) > -1 ||
            items.hora.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  viewDetails(item){
     this.navCtrl.push(DetailsrcPage, { item: item });
  }

}

