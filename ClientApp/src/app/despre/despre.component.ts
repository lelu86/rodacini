import { Component, OnInit } from '@angular/core';
import { SodService } from 'src/app/0servicii/sod.service';

@Component({
  selector: 'app-despre',
  templateUrl: './despre.component.html',
  styleUrls: ['./despre.component.scss']
})
export class DespreComponent implements OnInit {

  constructor(private robSod: SodService) { }

  sod: any;
  ngOnInit(): void {
    this.robSod.sendMessage.subscribe((message) => {
      this.sod = message;
    });
  }











}
