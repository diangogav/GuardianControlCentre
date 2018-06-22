import { Component } from '@angular/core';
import { NavController, DateTime,ToastController } from 'ionic-angular';
import { SearchrcPage } from '../searchrc/searchrc';
import { AddclosurePage } from '../../pages/addclosure/addclosure';

import { Time } from '@angular/common';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import { FirebaseDbProvider } from '../../providers/firebase-db/firebase-db';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import * as firebase from 'firebase/app';


import * as Leaflet from 'leaflet';
import 'leaflet-draw';

declare const L: any;
//let myObservable = Observable.interval(1000);

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  map: any;
  data: any;
  estado: any;
  items;
  errorMessage: string;
  markerArray: any[] = [];

  constructor(
    public navCtrl: NavController,
    public dbFirebase :FirebaseDbProvider,
    public afDB: AngularFireDatabase, 
    public toastCtrl: ToastController
  ) {

      

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
            this.showMarker(this.markerArray);
            toast.dismiss();
          });          
    
    

  }
      
  showMarker(markerArray) {
    if(markerArray.length > 0){
      var values;
      var date;
      var month;
      var year;
      var hour;
      var minutes;
      var actualDate = new Date();
      var expirationDate = new Date();
      console.log(markerArray);
      for (var i=0; i<markerArray.length;i++){
        values = markerArray[i].expirationDate.split("-");
        date = values[2];
        month = values[1];
        year = values[0];

        values = markerArray[i].expirationTime.split(":");
        hour = values[0];
        minutes = values[1];

        expirationDate.setDate(parseInt(date));
        expirationDate.setMonth(parseInt(month) - 1);
        expirationDate.setFullYear(parseInt(year));
        expirationDate.setHours(parseInt(hour));
        expirationDate.setMinutes(parseInt(minutes));

            var map = this.map
            var latitud;
            var longitud;
            
          
              if(expirationDate.getTime() < actualDate.getTime()){
                  
              }else{
          
                latitud = markerArray[i].latitudAdded
                longitud = markerArray[i].longitudAdded
                Leaflet.marker([latitud, longitud]).addTo(this.map)
                .bindPopup('soy el numero' + i)
                .openPopup();
              }
      }
    }
  }

  addClosurePage(){
    this.navCtrl.push(AddclosurePage);
  }

  ngOnInit():void{
   this.drawMap();
  }

  //MAPA LEAFLET
  drawMap():void{
    
    this.map = Leaflet.map('map').setView([-0.1836298, -78.4821206], 13);
    Leaflet.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: 'Guardian Control Centre',
      maxZoom: 18
    }).addTo(this.map);

    //SI HAY ERROR
    function onLocationError(e){
      alert(e.message);
      console.log(e.message);
    }

    this.map.on('locationerror', onLocationError);
    this.map.on('click', this.onMapClick,this);
  }

  showLocation(){
    var map = this.map;
    var popup = L.popup();

      function onMapClick(e) {
          popup
              .setLatLng(e.latlng)
              .setContent("Hiciste clic en el mapa en " + e.latlng.toString())
              .openOn(map);
      }

      if(this.estado == 1){
      map.on('click', onMapClick);
      this.estado = 0;
    }else{
      map.off('click');
      this.estado = 1;
     
    }
    
  }

  onMapClick(e) {
    this.addClosurePage();
  }

  searchClosure(){
    this.navCtrl.push(SearchrcPage);
  }
  
}