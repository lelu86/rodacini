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


@Component({
  selector: 'app-planteaza',
  templateUrl: './planteaza.component.html',
  styleUrls: ['./planteaza.component.scss']
})
export class PlanteazaComponent implements OnInit {

  sod: any; roc: any; //plantat:any
  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string, private robSod: SodService, private robRoc: RocService, /*private robPlantat: PlantatService,*/ /*private robCopacNou: CopacNouService,*/) {
    this.robSod.sendMessage.subscribe((message) => { this.sod = message; })
    this.robRoc.sendMessage.subscribe((message) => { this.roc = message; })
    //this.robPlantat.sendMessage.subscribe((message) => { this.plantat = message; })
  }

  //static peParcea: boolean = false;//pt ol //default value nu e false ci undefined: "A variable that has not been assigned a value is of type undefined"
  //static ePlantat:string='nu'
  ngOnInit(): void {
  }
  raspunsCopac?: Observable<any>
  mesajRaspunsCopac: any/*string = ""*/;
  onApasat()
  {
    if (ZhartaComponent.peParcea == true)
    {
      //this.robRoc.communicateMessage("cruce");
      let copac = new Copac();
      let parcea = new Parcea();
      copac.Nota = "nota eu";
      copac.Coordonate = ZhartaComponent.coorCruceVerde//"24.74147863320485,45.59946461741876"
      //console.log(copac.Coordonate,'   cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc')
      copac.Parcea = parcea
      this.raspunsCopac = this.http.post/*<Copac>*/(this.baseUrl + 'copac', copac, { responseType: 'text' })/*.subscribe()*///musai subscribe//dacă fac put-ul de tip <Copac> atunci crede că response-ul e Object https://stackoverflow.com/questions/73528018
      this.raspunsCopac.subscribe((s: any) => { this.mesajRaspunsCopac = s; console.log(`raspunsCopac.subscribe::::::::: `, s) })
      console.log(`aaaaaaaaaaaaaaaaaaaaaaaaaaa`)
      console.log(JSON.stringify(this.raspunsCopac))
      console.log(`zzzzzzzzzzzzzzzzzzzzzzzzzzz`)
      //this.robPlantat.communicateMessage('plantat')
      //console.log('--------------onApasat', this.plantat)
      //PlanteazaComponent.ePlantat = 'da'
      //this.robCopacNou.variable1 = /*!this.robCopacNou.variable1*/true
      ZhartaComponent.displayCopacNou()
      new bootstrap.Toast(document.getElementById('liveToast')!).show()//"!"bm
      
    }
    /*else
    {
      //this.robPlantat.communicateMessage('neplantat')
      //console.log('--------------onApasat',this.plantat)
      //this.robRoc.communicateMessage("radacina");
    }*/
  }



}


