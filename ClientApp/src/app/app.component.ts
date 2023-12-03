import { Component, Inject } from '@angular/core';//Inject bm
import { HttpClient } from '@angular/common/http';//bm
import { Observable } from 'rxjs';//bm
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

import * as semnalr from '@microsoft/signalr';

import { SodService } from 'src/app/0servicii/sod.service';
import { Binary } from '@angular/compiler';

export class Uzer {
  public id?: string
  public numord?: number
  public email?: string
  public supus?: boolean
  public juridica?: boolean=false
  public cui?: string
  public poza?: any//merge number, Binary, string, any, File, JSON, Blob și probabil orice da la toate am 400 bad request //string nu are .onload //le: rezolvat, e string da aci rămîne așa
  public nume?: string
  public yob?: number
  public sex?: string
  public localitate?: string
  public bio?: string
  public mailuri?: boolean
  public mina?: string='dreptaci'
  public culoare?: string
  public pleaca?: string
  public razgindiri?: string
  public limba?: string = 'ro'
  public limbuto?: boolean = false
  public neplatiti?: number
  public medalion?: any//e string da aci rămîne așa
  public prl?: string//[NotMapped] în db
  public etc?: string//[NotMapped] în db
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {//cum de merge ngOnInit dacă n-am implements OnInit?
  static hubConnection/*!*/: HubConnection
  title = 'app';
  sod: any
  static anon
  constructor(private robSod: SodService, private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {
    this.robSod.sendMessage.subscribe((message) => { this.sod = message; })
  }
  pz
  static Uzer = new Uzer()//neaparat cu new altfel e undefined (error undefined nu undefined gri)
  static UzerState = 'checking'//cît timp rămîn pur angular nu ar trebui să fie probleme că nu folosesc servicii, citește comentariile răspuncului: https://stackoverflow.com/a/45070358
  static contributia: any = { "contributia": 0 }
  static lastCenter
  static lastZoom
  ngOnInit(): void {
    AppComponent.Uzer.mina = 'dreptaci'///////////////////////////////////////////////////////!!!!!!!!!!!!!!!!!\\\\\\\\
    console.log(AppComponent.Uzer.mina,'ACACACACACACACACAC')
    AppComponent.hubConnection = new HubConnectionBuilder()
      //dev:
      //.withUrl('https://localhost:7113/rutaviu', { skipNegotiation: true, transport: semnalr.HttpTransportType.WebSockets })
      //live:
      .withUrl('/rutaviu', { skipNegotiation: true, transport: semnalr.HttpTransportType.WebSockets })
      .configureLogging(semnalr.LogLevel.Information)
      .build();//alert(this.baseUrl) e 44428 deci frontendu
    AppComponent.hubConnection.start()
      .then(() => console.log('00000000000000connection started'))
      .catch((e) => console.log('----------eroare----------: ' + e));
    AppComponent.Uzer.poza = new Image()
    AppComponent.Uzer.poza.src = ''
    console.log(AppComponent.Uzer, ' ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
    this.http.get(this.baseUrl + 'uzer/uzer')
      .subscribe((s: any) => {
        AppComponent.UzerState = 'neintrat'
        if (s != null) {
          AppComponent.UzerState = 'intrat'
          AppComponent.Uzer = s
          AppComponent.anon = 'anon' + AppComponent.Uzer.numord//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
          this.Sod(s.mina)
          this.Culoare(s.culoare)
          console.log(AppComponent.Uzer, ' uzer||||||||||||||||||||||||||||||||||||||||||||||||||||||||')
          AppComponent.Uzer.poza = new Image() //fără am Cannot create property 'src' on string ''
          AppComponent.Uzer.poza.src = s.poza
          ////////////////////
          document.getElementById('enhuro')!.style.transform = 'translateX(-6mm)'
          if (AppComponent.Uzer.limbuto == false) {
            document.getElementById('enhuro')!.style.display = 'none'
          }
          if (AppComponent.Uzer.limba == 'en') {
            document.getElementById('en')!.style.display = 'inline-block'
            //document.getElementById('en')!.style.transform = 'translateX(-6mm)'
            document.getElementById('hu')!.style.display = 'none'
            document.getElementById('ro')!.style.display = 'none'
          }
          if (AppComponent.Uzer.limba == 'hu') {
            document.getElementById('en')!.style.display = 'none'
            document.getElementById('hu')!.style.display = 'inline-block'
            //document.getElementById('hu')!.style.transform = 'translateX(-6mm)'
            document.getElementById('ro')!.style.display = 'none'
          }
          if (AppComponent.Uzer.limba == 'ro') {
            document.getElementById('en')!.style.display = 'none'
            document.getElementById('hu')!.style.display = 'none'
            document.getElementById('ro')!.style.display = 'inline-block'
            //document.getElementById('ro')!.style.transform = 'translateX(-6mm)'
          }
          if (AppComponent.Uzer.mina == 'stingaci') {
            document.getElementById('enhuro')!.style.right = '0%'
            document.getElementById('enhuro')!.style.transform = 'scaleX(-1) translateX(-6mm)'
          }
          //////////////////////
        }
      })
    this.http.get(this.baseUrl + 'contributia.json'/*, { responseType: 'text' }*/)//valoare inițială plus live-ul pt contribuție o fac în appcomponent pt că nu știu care din cele două locuri unde o folosesc e activat primul, zdespre sau plata. iar signalr se pare că te forțează să fi eficient și să ai o singură conexiune din frontend per endpoint
      .subscribe((s: any) => {
        AppComponent.contributia.contributia = s.contributia//doar cu s nu cu (s:any) puteam avea doar s nu s.contributia
        console.log(s, ' sCCsCCsCCsCCsCCsCCsCCsCCsCCsCCsCCsCCsCCsCCsCCsCCsCCsCCsCCsCCsCCsCCsCCsCCsCCsCCsCC')
      }
    )
    AppComponent.hubConnection.on('contributia', (x) => {//am avut odată no client method found with name contributia după start
      AppComponent.contributia.contributia = x
      console.log(x, ' +++contributia+++++++++++++++++++++++++++++++++++++++++++++')
      });
  }

  Sod(mina: any) {
    this.robSod.communicateMessage(mina)
  }

  Culoare(culoare: any) {
    console.log('s.culoare app::::::::::::::::::::::::::: ', culoare)
    document.documentElement.style.setProperty('--culoare-butoane', culoare)
  }

  get getUzer() {
    return AppComponent.Uzer
  }
}
