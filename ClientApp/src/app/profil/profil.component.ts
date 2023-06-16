import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';//headers bm
import { SodService } from 'src/app/0servicii/sod.service';
//import { AuthorizeService } from 'src/api-authorization/authorize.service';
import { Observable ,filter ,take} from 'rxjs';//,filter ,take bm
import { map } from 'rxjs/operators';//.map în .pipe

/*class Uzer {
  public supus?: boolean;
  public sters?: any;
  public juridica?: boolean;
  public cui?: string;
  public poza?: any;
  public nume?: string;
  public yob?: number;
  public sex?: string;
  public localitate?: string;
  public bio?: string;
  public mailuri?: boolean;
  public mina?: string;
  public paleta?: string;
}*/

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {

  sod: any
  iiAutenticat?: Observable<any>
  public numaNume?: Observable<string[] | null | undefined>
  constructor(private robSod: SodService, /*private robAuthorize: AuthorizeService,*/ private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {
    this.robSod.sendMessage.subscribe((message) => { this.sod = message; })
    //apă sfințită //doar de informare //și de fapt îs autentificat și înainte să intru la /profil deci la Zprofil da no, viața-i greu
    //this.iiAutenticat = this.robAuthorize.isAuthenticated();
    //this.iiAutenticat.subscribe(s => console.log(`iiAutenticat::: ${s}`))
    //așa nu merge pînă ce /profil nu dă o tură pe la Duende da deocamdată rămîne neșters. oricum, nu șterg înainte să implementez un get la delogare, altfel o să rămînă userul pe butonul de profil
    //this.numaNume = this.robAuthorize.getUser().pipe(map(u => u! && u.name!.split("@", 1)))//"!" e crucial. pare că merge și "(u && u.name)!"
    //this.numaNume.subscribe(s => console.log(`salut::: ${s}`))//"With a regular observable you only get the value when it changes, so if you want to console.log out the value you will need to console.log it in the subscription"//sau alert(raspuns) în loc de console.log(...)
  }

  uzerNumeMail?: Observable<string>
  sirUzerNumeMail: string = ""
  static staticSirUzerNumeMail: string
  ngOnInit(): void {
    //așa merge de cum se încarcă aplicația, deci pun {{uzerNumeMail}} în buton nu {{numaNume}}
    this.uzerNumeMail = this.http.get(this.baseUrl + 'uzernumemail', { responseType: 'text' })//https://stackoverflow.com/a/56865321  
    this.uzerNumeMail.subscribe(s => { this.sirUzerNumeMail = s; ProfilComponent.staticSirUzerNumeMail = s;  console.log(`sssssssssssssssssssssssssss`, s) })//nu mă comenta!!!//fără this.sir=s nu pot lua valoarea afară din uzerNumeMail, va fi tot ceva de genu Object obbject sau Source source!!!!!!!!!
    console.log(`aaaaaaaaaaaaaaaaaaaaaaaaaaa`)//nu merge da măcar în .subscribe(...) merge
    console.log(this.uzerNumeMail)
    console.log(JSON.stringify(this.uzerNumeMail))
    console.log(this.sirUzerNumeMail)//<sting empty> cică. da slavă cerului că de fapt conține valoarea lui uzerNumeMail
    console.log(JSON.stringify(this.sirUzerNumeMail))
    console.log(`zzzzzzzzzzzzzzzzzzzzzzzzzzz`)
  }
}
