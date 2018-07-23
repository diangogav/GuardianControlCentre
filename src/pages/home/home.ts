import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController,ToastController  } from 'ionic-angular';
import { FirebaseDbProvider } from '../../providers/firebase-db/firebase-db';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

import leaflet from 'leaflet';
import * as firebase from 'firebase/app';

import { SearchrcPage } from '../searchrc/searchrc';
import { AddclosurePage } from '../../pages/addclosure/addclosure';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('map') mapContainer: ElementRef;
  map: any;
  items;
  markerArray: any[] = [];

  constructor(
    public navCtrl: NavController,
    public dbFirebase :FirebaseDbProvider,
    public afDB: AngularFireDatabase, 
    public toastCtrl: ToastController
) {

  this.getMarkers();

  }
 
  ionViewDidEnter() {


  }

  ngOnInit():void{
    this.loadmap();
   }
 
  loadmap() {
    this.map = leaflet.map('map').setView([-0.1836298, -78.4821206], 13);
    leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attributions: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18
    }).addTo(this.map);


    this.map.locate({
      setView: true,
    }).on('locationfound', (e) => {
      var radius = e.accuracy / 2;

      let markerGroup = leaflet.featureGroup();
      let marker: any = leaflet.marker([e.latitude, e.longitude])
      .bindPopup("Estás dentro de los " + radius + "metros desde este punto").openPopup();
          
      markerGroup.addLayer(marker);
      this.map.addLayer(markerGroup);
      leaflet.circle(e.latlng, radius).addTo(this.map);

      }).on('locationerror', (err) => {
        alert(err.message);
    })
 
  }


  //=======================================================================================================
showMarker(markerArray) {
    if(markerArray.length > 0){
        var name;
        var startDate;
        var startTime;
        var endDate;
        var endTime;

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
          name = markerArray[i].shortDescription;
          startDate = markerArray[i].actualStartClosure;
          startTime = markerArray[i].hour;
          endDate = markerArray[i].expirationDate;
          endTime = markerArray[i].expirationTime;

          
          console.log(name);

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

                  var status = {
                    status: "expired"
                  }
                  firebase.database().ref('markers/' + markerArray[i].id).update(status);
                  console.log(markerArray[i].id);
                    
                }else{

                  console.log("holaaaa");


                  latitud = markerArray[i].latitudAdded
                  longitud = markerArray[i].longitudAdded

                  let markerGroup = leaflet.featureGroup();



                  
                  let marker: any = leaflet .marker([latitud, longitud])
                  .bindPopup( name +'</br><b>Started: </b>'+ startDate +' <b> at </b> '+ startTime
                  +'</br><b>End: </b>'+ endDate +' <b> at </b> '+ endTime) .openPopup();

                  markerGroup.addLayer(marker);
                  this.map.addLayer(markerGroup);
        }
      }
    }
  }
//============================================================================
  getMarkers(){
    this.items = firebase.database().ref('markers').orderByChild("status").equalTo('current');
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
            console.log(this.markerArray);
            this.showMarker(this.markerArray);
            toast.dismiss();
          }); 

  }
//=============================================================================
  addClosurePage(){
    this.navCtrl.push(AddclosurePage);
  }

  onMapClick(e) {
    this.addClosurePage();
  }

  searchClosure(){
    this.navCtrl.push(SearchrcPage);
  }

}
