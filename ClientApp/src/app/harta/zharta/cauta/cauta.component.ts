import { Component, OnInit } from '@angular/core';
import { SodService } from 'src/app/0servicii/sod.service';

@Component({
  selector: 'app-cauta',
  templateUrl: './cauta.component.html',
  styleUrls: ['./cauta.component.scss']
})
export class CautaComponent implements OnInit {

  constructor(private robSod: SodService) { }

  sod: any;
  ngOnInit(): void {
    this.robSod.sendMessage.subscribe((message) => {
      this.sod = message;///ezoz //console.log('copac sod ngOnInit: ', this.sod);
    });
  }

}
