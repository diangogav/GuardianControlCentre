import { UpdatePage } from '../update/update';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController, App } from 'ionic-angular';
import {Observable} from 'rxjs/Observable';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import firebase from 'firebase';
import { AuthProvider } from '../../providers/auth/auth';
import { UserProvider } from '../../providers/user/user';

import { SearchrcPage } from '../searchrc/searchrc';

import leaflet from 'leaflet';


/**
 * Generated class for the DetailsrcPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detailsrc',
  templateUrl: 'detailsrc.html',
})
export class DetailsrcPage {

  item;
  map: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public afDB: AngularFireDatabase,
    public auth: AuthProvider,
    public userProvider: UserProvider,
    public app: App,
    public loadingCtrl: LoadingController  
    ) {   
      this.item = navParams.data.item;   
    }

  ngOnInit():void{

   this.drawMap();
  }

  //mapa leaflet
  drawMap():void{
    this.map = leaflet.map('mapa').setView([this.item.latitudAdded, this.item.longitudAdded], 13);
    leaflet.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: 'Guardian Control Centre',
      maxZoom: 18
    }).addTo(this.map);
    
    let markerGroup = leaflet.featureGroup();
    let marker: any = leaflet.marker([this.item.latitudAdded, this.item.longitudAdded])
    .bindPopup("Accident").openPopup();
        
    markerGroup.addLayer(marker);
    this.map.addLayer(markerGroup);
  }

    

  searchClosure()
    {
      this.navCtrl.push(SearchrcPage);
    }

}

