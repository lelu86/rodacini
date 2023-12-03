import { Component, OnInit,Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'

import { SodService } from 'src/app/0servicii/sod.service';
import { AppComponent } from 'src/app/app.component'


@Component({
  selector: 'app-statistici',
  templateUrl: './statistici.component.html',
  styleUrls: ['./statistici.component.scss']
})

export class StatisticiComponent implements OnInit {

  constructor(private robSod: SodService, private http: HttpClient, @Inject('BASE_URL') private baseUrl: string/*, private hubConnection: semnalr.HubConnection*/) { }

  sod: any;
  static numarCopaci
  ngOnInit(): void {
    this.http.get(this.baseUrl + 'copac/numarcopacs'/*, { responseType: 'text' }*/)
      .subscribe(s => { StatisticiComponent.numarCopaci = s })
    this.robSod.sendMessage
      .subscribe((message) => { this.sod = message; })
    AppComponent.hubConnection.on('nou', (x) => {
      //this.sirNumarCopaci = n;
      StatisticiComponent.numarCopaci = x
      console.log(x, ' +++++++++++++++++++++++++++++++++++++++++++++');
    });
  }

  get numarCopaci() {
    return StatisticiComponent.numarCopaci
  }
}
