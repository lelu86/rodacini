import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AppComponent, Uzer } from 'src/app/app.component'

import * as bootstrap from 'bootstrap';
import * as $ from 'jquery';

@Component({
  selector: 'app-ztop',
  templateUrl: './ztop.component.html',
  styleUrls: ['./ztop.component.scss']
})
export class ZtopComponent implements OnInit {
  toputi
  toporg
  width = 37.795275591
  height = 37.795275591

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

  incarc=true
  ngOnInit(): void {
    this.http.get(this.baseUrl + 'top/topUtilizatori')
      .subscribe((s: any) => {
        console.log('-------------------------------------------------------------------------------')
        console.log(`/top/topUtilizatori subscribe::::::::::::::::::::::::::: `, s)
        console.log('-------------------------------------------------------------------------------')
        this.toputi = s
        this.incarc=false
      })
    this.http.get(this.baseUrl + 'top/topOrganizatii')
      .subscribe((s: any) => {
        console.log('-------------------------------------------------------------------------------')
        console.log(`/top/topOrganizatii subscribe::::::::::::::::::::::::::: `, s)
        console.log('-------------------------------------------------------------------------------')
        this.toporg = s
        this.incarc = false
      })
  }

  get getUzer() {
    return AppComponent.Uzer
  }
}

/*var timer: any
$(document).on('mousemove', function () {
  clearTimeout(timer);
  $('#res').text('Mouse moving');
  timer = setTimeout(function () {
    $('#res').text('Mouse not moving');
  }, 500);
});*/
