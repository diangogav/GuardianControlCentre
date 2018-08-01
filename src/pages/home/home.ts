import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController,ToastController  } from 'ionic-angular';
import { FirebaseDbProvider } from '../../providers/firebase-db/firebase-db';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval'

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
  markerMapID: any[] = [];
  timerVar;
  markerGroup;
  actualDate = new Date();

  constructor(
    public navCtrl: NavController,
    public dbFirebase :FirebaseDbProvider,
    public afDB: AngularFireDatabase, 
    public toastCtrl: ToastController
) {

  this.getMarkers();
  this.startRefreshMarkersTimer();
  }
 
  ionViewDidEnter() {


  }

  ngOnInit():void{
    this.loadmap();
   }
 
//==============================================================================================================================
//Load the leaflet map   
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


//===============================================================================================================================
//Show marker in the leaflet map

showMarker(markerArray) {
    if(markerArray.length > 0){
        var name;
        var startDate;
        var startTime;
        var endDate;
        var endTime;


        for (var i=0; i<markerArray.length;i++){
          
          name = markerArray[i].shortDescription;
          startDate = markerArray[i].actualStartClosure;
          startTime = markerArray[i].hour;
          endDate = markerArray[i].expirationDate;
          endTime = markerArray[i].expirationTime;

          var markerExpiration = new Date();
          
          markerExpiration = this.getExpirationDate(markerArray[i].expirationDate,markerArray[i].expirationTime)

              var latitud;
              var longitud;
                          
                if(markerExpiration.getTime() < this.actualDate.getTime()){


                  var status = {
                    status: "expired"
                  }
                  firebase.database().ref('markers/' + markerArray[i].id).update(status);
                    
                }else{

                  latitud = markerArray[i].latitudAdded
                  longitud = markerArray[i].longitudAdded

                  this.markerGroup = leaflet.featureGroup();

                  let marker: any = leaflet .marker([latitud, longitud])
                  .bindPopup( name +'</br><b>Started: </b>'+ startDate +' <b> at </b> '+ startTime
                  +'</br><b>End: </b>'+ endDate +' <b> at </b> '+ endTime) .openPopup();

                  this.markerGroup.addLayer(marker);
                  
                  this.markerMapID.push(this.markerGroup.getLayerId(marker));

                  this.map.addLayer(this.markerGroup);

        }
      }
    }
  }
//===============================================================================================================================
//Get markers from de firebase

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
            this.showMarker(this.markerArray);
            toast.dismiss();
          }); 

  }
//===============================================================================================================================
//Nav to the AddclosurePage
  addClosurePage(){
    this.navCtrl.push(AddclosurePage);
  }

//===============================================================================================================================
//Refresh de status for the markers

startRefreshMarkersTimer(){


   this.timerVar = Observable.interval(5000).subscribe(x => {
     
      var actualDate = new Date();

      for (var i=0; i<this.markerArray.length;i++){
        
        var actualExpiration = this.getExpirationDate(this.markerArray[i].expirationDate,this.markerArray[i].expirationTime)

        if(actualExpiration.getTime() < actualDate.getTime()){

          this.markerGroup.removeLayer(this.markerMapID[i]);
          this.markerMapID = this.markerMapID.splice(i+1,1);

          var status = {
            status: "expired"
          }
          
          firebase.database().ref('markers/' + this.markerArray[i].id).update(status);

        }
      }                    
    })
  }

//===============================================================================================================================
//Refresh de status for the markers

  onMapClick(e) {
    this.addClosurePage();
  }  

  searchClosure(){
    this.navCtrl.push(SearchrcPage);
  }  


//===============================================================================================================================
//Return Date Object with the expiration date for the current marker
  getExpirationDate(markerExpirationDateFirebase,markerExpirationTimeFirebase){

          var values;
          var date;
          var month;
          var year;
          var hour;
          var minutes;
          

          values = markerExpirationDateFirebase.split("-");
          date = values[2];
          month = values[1];
          year = values[0];

          values = markerExpirationTimeFirebase.split(":");
          hour = values[0];
          minutes = values[1];

          var expirationDate = new Date(
            year,
            (month-1),
            date,
            hour,
            minutes
            )

          return expirationDate;

    }
  

}
