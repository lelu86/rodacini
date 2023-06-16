import { Component, OnInit,Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { Observable } from 'rxjs'

import * as semnalr from '@microsoft/signalr';

import { SodService } from 'src/app/0servicii/sod.service';

@Component({
  selector: 'app-statistici',
  templateUrl: './statistici.component.html',
  styleUrls: ['./statistici.component.scss']
})

export class StatisticiComponent implements OnInit {
  private _hubConnection!: HubConnection;

  constructor(private robSod: SodService, private http: HttpClient, @Inject('BASE_URL') private baseUrl: string/*, private hubConnection: semnalr.HubConnection*/) { }

  sod: any;
  numarCopaci?: Observable<string>
  sirNumarCopaci: string = ""
  ngOnInit(): void {
    this.numarCopaci = this.http.get(this.baseUrl + 'numarcopacs', { responseType: 'text' })
    this.numarCopaci.subscribe(s => { this.sirNumarCopaci = s; console.log(`nrnrnrnrnrnrnrnrnr`, s) })
    this.robSod.sendMessage.subscribe((message) => {
      this.sod = message; //console.log('despre message ngOnInit: ', message);
    });
    ///////////////
    this._hubConnection = new HubConnectionBuilder()
      .withUrl(/*'https://localhost:7116/rutaviu'*/'/rutaviu', { skipNegotiation: true, transport: semnalr.HttpTransportType.WebSockets })
      .configureLogging(semnalr.LogLevel.Information)
      .build();//alert(this.baseUrl) e 44428 deci frontendu. am încercat 1)RutaviuController cu /rutaviu în proxy.conf.js 2)MapHub în AddEndpoint or smth //le: nu merge în dev, în prod merge ca norocu
    ///////////////
    this._hubConnection.send(/*'SendMessage'*/'nou', 'test message test message test message test message test message test message test message test message test message')
      .then(r => { console.log('nou-nou-nou-nou-nou-nou-nou-nou-nou') });
    ///////////////
    this._hubConnection.on('nou', (nr) => {
      this.sirNumarCopaci = nr;
      console.log(nr, '+++++++++++++++++++++++++++++++++++++++++++++');
    });
    ///////////////
    this._hubConnection.start()
      .then(() => console.log('00000000000000connection started'))
      .catch((err) => console.log('----------error while establishing signalr connection: ' + err));
    ///////////////
  }
}
