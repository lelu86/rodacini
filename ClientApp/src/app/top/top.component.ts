import {Component, OnInit } from '@angular/core';
import { SodService } from 'src/app/0servicii/sod.service';
import { Subject } from 'rxjs';
import * as bootstrap from 'bootstrap';
import * as $ from 'jquery';



@Component({
  selector: 'app-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.scss']
})
export class TopComponent implements OnInit {

  constructor(private robSod: SodService,){}

  sod: any;
  ngOnInit(): void {
    this.robSod.sendMessage.subscribe((message) => {
      this.sod = message; //console.log('despre message ngOnInit: ', message);
    });
  }


}
