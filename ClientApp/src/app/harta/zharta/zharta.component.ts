import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { lastValueFrom, take } from 'rxjs'

import * as $ from 'jquery';

import * as ol from 'ol';
//import 'ol/ol.css';//(nu mai) parse error da fără el nu se stilează controalele//amu mere. poate fiincă am adăugat ol style in angular.json
import Map from 'ol/Map';
import View from 'ol/View';
import { OSM } from 'ol/source';
import TileLayer from 'ol/layer/Tile';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector'; //mere și: import VectorLayer from 'ol/layer/Tile'; //le: ăla o fi vector tile
import VectorSource from 'ol/source/Vector';
import XYZ from 'ol/source/XYZ';
import Link from 'ol/interaction/Link';
import Modify from 'ol/interaction/Modify'
import Draw from 'ol/interaction/Draw'
import Snap from 'ol/interaction/Snap'
import { Style, Icon, Text, Fill, Stroke } from 'ol/style';
import { Color } from 'ol/color'
import { asString } from 'ol/color'

import MapEvent from 'ol/MapEvent'
import Point from 'ol/geom/Point'

import { RocService } from 'src/app/0servicii/roc.service';
//import { PlantatService } from 'src/app/0servicii/plantat.service';
//import { CopacNouService } from 'src/app/0servicii/copac-nou.service';
import {Copac } from 'src/app/0modele/copac'

import { PlanteazaComponent } from '../planteaza.component'
import { Coordinate, toStringXY } from 'ol/coordinate';

import { ProfilComponent } from  'src/app/profil/profil.component'




@Component({
  selector: 'app-zharta',
  templateUrl: './zharta.component.html',
  styleUrls: ['./zharta.component.scss']
})
export class ZhartaComponent implements OnInit {

  roc: any; //plantat: any; //robCopacNou:any
  constructor(private robRoc: RocService, private http: HttpClient, @Inject('BASE_URL') private baseUrl: string/*private robPlantat: PlantatService,*/ /*private robCopacNou: CopacNouService,*/) {
    this.robRoc.sendMessage.subscribe((message) => { this.roc = message; });
    //this.robPlantat.sendMessage.subscribe((message) => { this.plantat = message; })
  }

  static map: Map
  centru: any
  parceaslayer = new VectorLayer({
    source: new VectorSource({
      format: new GeoJSON(),//fără dispar controalele
      //url: 'https://openlayers.org/en/v4.6.5/examples/data/geojson/countries.geojson',//'./countries.geojson' nu merge //ar trebui să mearg căci dacă eu vreu să am o hartă în spa?
      //url: 'https://localhost:7116/parceas.json',//se pare că nu trimite ".geojson"//cors missing allow origin or smth cîteodată
      url: '/assets/parceas.json',
    }),
    style: new Style({
      fill: new Fill({
        color: 'rgba(55, 155, 55, 0.0)'
      }),
      stroke: new Stroke({
        color: 'rgba(255, 0, 0, 1.0)',
        width: 1
      }),
    }),
  })
  view = new View({//longitude and latitude coordinates ////definesc afară căci tre să fac niște experimente cu view-ul
    //osm moldoveanu 45.5995641,24.7361706 ; 2753617.910420,5716409.672611
    //gmap &center=45.5997663,24.7361481&zoom=13&maptype=satellite
    center: [2753617.910420 - 25, 5716409.672611],//If you do not explicitly set one, your map is going to use our default which is the Web Mercator projection (EPSG:3857)//adică " projection: 'EPSG:3857' "
    zoom: 12, minZoom: 6, maxZoom: 18,//18 e max pt esri sattelite
    extent: [2753617.967327 - 600000, 5716409.482865 - 600000, 2753617.967327 + 600000, 5716409.482865 + 600000],//nv e,n; se e,n or smth//dacă nu-s toate la fel, eg 600000, la ultimul zoom out se descentrează
  })
  static peParcea: boolean = false;//pt ol //default value nu e false ci undefined: "A variable that has not been assigned a value is of type undefined"
  get staticPeParcea() {
    return ZhartaComponent.peParcea;
  }//altfel nu o pot folosi în html
  static coorCruceVerde: string //Coordinate | undefined
  //copacii: Observable<any/*Copac*/>
  //copacii:any/*Copac*//*[]*/

  ngOnInit(): void {
    ZhartaComponent.map = new Map({
      target: 'harta',
      layers: [
        new TileLayer({//esri layer
          source: new XYZ/*OSM*/({
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            maxZoom: 19
          })
        }),
        this.parceaslayer,//parceas layer //l-am definit afară căci tre să lucrez cu featurele din el
        new VectorLayer({//graniță layer
          source: new VectorSource({
            format: new GeoJSON(),
            //url: 'https://localhost:7116/ro_frontiera_polilinie.json',
            url: '/assets/ro_frontiera_polilinie.json',
          }),
          style: new Style({
            stroke: new Stroke({
              color: 'rgba(255, 255, 255, 1.0)',
              width: 1
            }),
          }),
        }),
      ],
      view: this.view,
    });
    ZhartaComponent.map.addInteraction(new Link())//pt rămas în poziție la refreș, chiar și recompile, din păcate nu și după route change //de comentat on extent testing
    //this.map.addInteraction(new ol.PinchZoom())
    //this.map.addInteraction(new ol.MouseWheelZoom())
    /*this.map.addInteraction(
      new Modify({
        //source: source,
      })
    );
    this.map.addInteraction(
      new Draw({
        type: 'Polygon',
        //source: source,
      })
    );
    this.map.addInteraction(
      new Snap({
        //source: source,
      })
    );*/

    ZhartaComponent.map.on('rendercomplete', () => { this.getCoord() })//neaparat sintaxa așa //tot nu-i ok la zoom căci nu se schimbă crucea între doi dinți consecutivi ai rotiței. și nici chiar între mai mulți dinți dacă rotirea e prea rapidă
    const el = document.getElementById("harta")!//"!" bm
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {// el is visible
      } else {// el is not visible
        ZhartaComponent.peParcea = false//fără asta aici cînd apăs pe butonul rădăcină fiind la, să zicem, top, și crucea am lăsat-o verde,va planta
        this.robRoc.communicateMessage("radacina");
      }
    })
    observer.observe(el) // Asynchronous call //https://stackoverflow.com/a/68961408

    console.log('(((((((((((((((((((((((((((')
    this.http.get/*<Copac[]>*/(this.baseUrl + 'copac').subscribe(s => {
      console.log(`.subscribe s copacii::::::::: `, s)
      //console.log(`.subscribe s[1].Coordonate::::::::: `, s[1].Coordonate)
      //console.log(`s copacii get stringify::::::::: `, JSON.stringify(s))
      this.displayCopacii(s)
    })//același response și cu <Copac> și fără dar cu <Copac> pot face s[7].Coordonate da e undefined
  }

  static copaciiSource = new VectorSource({})
  displayCopacii(s: any) {
    var copaciiLayer = new VectorLayer({
      source: ZhartaComponent.copaciiSource
    })
    for (var i of s) {
      var sliceat = i.coordonate.slice(1,-1)
      var splitat = sliceat.split(",")
      var sting = Number(splitat[0])
      var drept = Number(splitat[1])
      var coord = [sting,drept]
      console.log('coord::::::::: ', coord)
      var point = new Point(coord)
      var feature = new ol.Feature({ geometry: point })
      feature.setStyle(
        new Style({
          image: new Icon({
            src: "/assets/img/profil.svg",
            scale: 0.5
          }),
          text: new Text({
            text: i.numeUzer,
            offsetY: 10,
            fill: new Fill({
              color: 'azure'
            })
          })
        })
      )
      ZhartaComponent.copaciiSource.addFeature(feature)//există și .addFeatures([])
    }
    ZhartaComponent.map.addLayer(copaciiLayer)
  }

  static displayCopacNou() {
    var mijloccoordonate = ZhartaComponent.map.getView().getCenter()
    var point = new Point(mijloccoordonate!)
    var feature = new ol.Feature({ geometry: point })
    feature.setStyle(
      new Style({
        image: new Icon({
          src: "/assets/img/profil.svg",
          scale: 0.5
        }),
        text: new Text({
          text: ProfilComponent.staticSirUzerNumeMail,
          offsetY: 10,
          fill: new Fill({
            color: 'azure'
          })
        })
      })
    )
    ZhartaComponent.copaciiSource.addFeature(feature)
  }

  getCoord() {
    var mijloccoordonate = ZhartaComponent.map.getView().getCenter()
    var sourcele: any = this.parceaslayer.getSource()
    var featurelelamijloccoordonate = 0//trebuie să-l resetez altfel "featurelelamijloccoordonate!=0" e true și cînd crucea-i afară 
    featurelelamijloccoordonate = sourcele.getFeaturesAtCoordinate(mijloccoordonate)
    if (featurelelamijloccoordonate != 0) {
      ZhartaComponent.peParcea = true
      ZhartaComponent.coorCruceVerde = JSON.stringify(ZhartaComponent.map.getView().getCenter())//toStringXY(this.map.getView().getCenter(),11)
      this.robRoc.communicateMessage("cruce");
      console.log(ZhartaComponent.peParcea)
    }
    else {
      ZhartaComponent.peParcea = false
      this.robRoc.communicateMessage("radacina");
    }
  }
}





