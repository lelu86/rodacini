import { Component, OnInit } from '@angular/core';
import * as bootstrap from 'bootstrap';
import * as $ from 'jquery';

@Component({
  selector: 'app-ztop',
  templateUrl: './ztop.component.html',
  styleUrls: ['./ztop.component.scss']
})
export class ZtopComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    




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
