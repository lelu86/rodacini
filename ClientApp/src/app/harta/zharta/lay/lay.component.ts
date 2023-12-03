import { Component, OnInit } from '@angular/core'
import { SodService } from 'src/app/0servicii/sod.service'
import { ZhartaComponent } from 'src/app/harta/zharta/zharta.component'
import { AppComponent } from 'src/app/app.component'
import { OSM, XYZ, TileWMS } from 'ol/source'
import * as dolar from "jquery";

@Component({
  selector: 'app-lay',
  templateUrl: './lay.component.html',
  styleUrls: ['./lay.component.css']
})
export class LayComponent implements OnInit {

  constructor(private robSod: SodService) { }

  sod: any
  culoareButoane50Alpha
  ngOnInit(): void {
    this.robSod.sendMessage.subscribe((message) => {
      this.sod = message
    })
    //let bodyStyles = window.getComputedStyle(document.body);
    //this.culoareButoane50Alpha = bodyStyles.getPropertyValue('--culoare-butoane');
    var color = dolar('#pentru_jq').css('backgroundColor');
    var rgb = /rgb\((\d+), (\d+), (\d+)\)/.exec(color);
    var r = rgb![1],g = rgb![2],b = rgb![3];
    console.log('Red  :' + r);console.log('Green:' + g);console.log('Blue :' + b);
    this.culoareButoane50Alpha = `rgba(${r},${g},${b},0.5)`
    console.log(this.culoareButoane50Alpha,' ______________________________________________________________________')
  }

  swapFundal() {
    /*ZhartaComponent.map.getAllLayers().forEach((l)=> {
    })*///rămîne ca exemplu
    if (ZhartaComponent.clay == 'ESRI') {
      ZhartaComponent.esriLayer.setVisible(false)
      ZhartaComponent.osmLayer.setVisible(true)
      ZhartaComponent.clay = 'OSM'
    }
    else if (ZhartaComponent.clay == 'OSM') {
      ZhartaComponent.osmLayer.setVisible(false)
      ZhartaComponent.esriLayer.setVisible(true)
      ZhartaComponent.clay = 'ESRI'
    }
  }

  /*get */getClay() {
    return ZhartaComponent.clay
  }

  get getUzer() {
    return AppComponent.Uzer
  }

}
