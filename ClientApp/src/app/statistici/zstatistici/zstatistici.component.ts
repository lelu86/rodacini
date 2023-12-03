import { Component, OnInit } from '@angular/core';

import { StatisticiComponent } from 'src/app/statistici/statistici.component'
import { AppComponent } from 'src/app/app.component'


@Component({
  selector: 'app-zstatistici',
  templateUrl: './zstatistici.component.html',
  styleUrls: ['./zstatistici.component.scss']
})
export class ZstatisticiComponent implements OnInit {

  oxigen

  constructor() { }

  ngOnInit(): void {
    //this.oxigen = (StatisticiComponent.numarCopaci * 0.117934).toString().replace(/\./g, ",")
    this.oxigen = (StatisticiComponent.numarCopaci * 0.117934).toFixed(2).replace(/\./g, ",")
  }
  
  get numarCopaci() {
    return StatisticiComponent.numarCopaci
  }

  get getUzer() {
    return AppComponent.Uzer
  }

}
