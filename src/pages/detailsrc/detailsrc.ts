import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { SearchrcPage } from '../searchrc/searchrc';

import * as Leaflet from 'leaflet';
import 'leaflet-draw';

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

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public viewCtrl: ViewController)
            {
                  this.item = navParams.data.item;
            }

  ngOnInit():void{
   this.drawMap();
  }

  //mapa leaflet
  drawMap():void{
   let mapa = Leaflet.map('mapa').setView([-0.1836298, -78.4821206], 13);
    Leaflet.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: 'Guardian Control Centre',
      maxZoom: 18
    }).addTo(mapa);
    
      Leaflet.marker(
        [-0.126332,-78.491907]   
      ).addTo(mapa);
  }

    

  searchClosure()
    {
      this.navCtrl.push(SearchrcPage);
    }

}

