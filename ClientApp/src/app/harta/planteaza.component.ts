import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';//,filter ,take bm
import * as bootstrap from 'bootstrap';

import { SodService } from 'src/app/0servicii/sod.service';
import { RocService } from 'src/app/0servicii/roc.service';
//import { PlantatService } from 'src/app/0servicii/plantat.service';
//import { CopacNouService } from 'src/app/0servicii/copac-nou.service';

import { Copac } from 'src/app/0modele/copac';
import { Parcea } from 'src/app/0modele/parcea';
import { ZhartaComponent } from './zharta/zharta.component'
import { AppComponent } from 'src/app/app.component'



@Component({
  selector: 'app-planteaza',
  templateUrl: './planteaza.component.html',
  styleUrls: ['./planteaza.component.scss']
})
export class PlanteazaComponent implements OnInit {

  sod: any; roc: any;
  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string, private robSod: SodService, private robRoc: RocService, /*private robPlantat: PlantatService,*/ /*private robCopacNou: CopacNouService,*/) {
    this.robSod.sendMessage.subscribe((message) => { this.sod = message; })
    this.robRoc.sendMessage.subscribe((message) => { this.roc = message; })
  }

  //static peParcea: boolean = false;//pt ol //default value nu e false ci undefined: "A variable that has not been assigned a value is of type undefined"
  ngOnInit(): void {
  }

  raspunsCopac?: Observable<any>
  mesajRaspunsCopac: any
  onApasat()
  {
    /*if (ZhartaComponent.urele.length > 0) {//if-ul e ca să-mi apară harta după ce am dat refreș în, să zicem, profil și vin înapoi la hartă
      window.location.href = ZhartaComponent.urele//dacă vreau să supraviețuiască refreșului pot folsi localStorage.setItem("someVarKey", someVarName) cu localStorage.getItem("someVarKey") sau put la Uzer.Urele la fiecare părăsire a hărții
    }*///păstrez ca exemplu
    if (ZhartaComponent.peParcea == true)
    {
      (document.getElementById('aidi-refresh') as any).style.display = 'inline-block'
      setTimeout("document.getElementById('aidi-refresh').style.display = 'none'", 1000)
      let copac = new Copac();
      let parcea = new Parcea();
      copac.Nota = "nota eu";
      copac.Coordonate = ZhartaComponent.coorCruceVerde//"24.74147863320485,45.59946461741876"
      copac.Parcea = parcea
      this.raspunsCopac = this.http.post/*<Copac>*/(this.baseUrl + 'copac', copac, { responseType: 'text' })/*.subscribe()*///musai subscribe//dacă fac put-ul de tip <Copac> atunci crede că response-ul e Object https://stackoverflow.com/questions/73528018
      this.raspunsCopac
        .subscribe((s: any) => {
          AppComponent.Uzer.etc=s
          this.mesajRaspunsCopac = s;
          console.log(`raspunsCopac.subscribe::::::::: `, s)
          this.http.get(this.baseUrl + 'uzer/uzer')
            .subscribe((s: any) => {
              AppComponent.Uzer.neplatiti = s.neplatiti;
              ZhartaComponent.displayCopacii()
              let pmas = (document.getElementById('aidi-planteaza-mare-sting') as any)
              if (pmas /*(document.getElementById('planteaza-mare-sting') as any).style.display == 'inline-block'*/) {
                console.log('PMAS________________________________________________________ ');
                (document.getElementById('deplata-mare-sting') as any).style.display = 'inline-block'
              }
              let pmad = (document.getElementById('aidi-planteaza-mare-drept') as any)
              if (pmad /*(document.getElementById('planteaza-mare-drept') as any).style.display == 'inline-block'*/) {
                console.log('PMAD________________________________________________________ ');
                (document.getElementById('deplata-mare-drept') as any).style.display = 'inline-block'
              }
              let pmis = (document.getElementById('aidi-planteaza-mic-sting') as any)
              if (pmis /*(document.getElementById('planteaza-mic-sting') as any).style.display == 'inline-block'*/) {
                console.log('PMIS________________________________________________________ ');
                (document.getElementById('deplata-mic-sting') as any).style.display = 'inline-block'
              }
              let pmid = (document.getElementById('aidi-planteaza-mic-drept') as any)
              if (pmid /*(document.getElementById('planteaza-mic-drept') as any).style.display == 'inline-block'*/) {
                console.log('PMID________________________________________________________ ');
                (document.getElementById('deplata-mic-drept') as any).style.display = 'inline-block'
              }
            })
        })
      console.log(`aaaaaaaaaaaaaaaaaaaaaaaaaaa`)
      console.log(JSON.stringify(this.raspunsCopac))
      console.log(`zzzzzzzzzzzzzzzzzzzzzzzzzzz`)
      //ZhartaComponent.displayCopacNou()
      var x = document.getElementById("toast")
      x!.className = "show6s"
      setTimeout(function () { x!.className = x!.className.replace("show6s", ""); }, 6000)
    }
  }

  get getUzer() {
    return AppComponent.Uzer
  }

  get getUzerState() {
    //console.log(AppComponent.UzerState, ' <z<z<z<z<z<z<z<z<z<z<z<z<z<z<z<z<z<z<z<z<z<z<z<z<z<z')
    return AppComponent.UzerState
  }

}


