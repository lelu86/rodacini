import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SodService } from 'src/app/0servicii/sod.service';
//import { AuthorizeService } from 'src/api-authorization/authorize.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

class Uzer {
  public poza?: any;
  public nume?: string;
  public yob?: number;
  public sex?: string; /*= 'B'*/
  public loc?: string;
  public bio?: string;
  public mailuri?: boolean;
  public mina?: string; /*= 'dreptaci'*/
  public /*culoareButoane?*/paleta?: string; /*= 'lightcoral'//nu se poate underscore în sql column name*/

}

@Component({
  selector: 'app-zprofil',
  templateUrl: './zprofil.component.html',
  styleUrls: ['./zprofil.component.scss']
})
export class ZprofilComponent implements OnInit {
  selectedMonth = null;
  @ViewChild("formularProfil", { static: true }) formularProfilDiv!: ElementRef;
  public isAuthenticated?: Observable<boolean>;
  public userName?: Observable<string | null | undefined>;
  //cele 13750 localități vor fi în backend și le arat la live search//arayul va fi populat cu max zece rezultate
  localitati = ['Live Search 1', 'Live Search 2', 'Live Search 3', 'Live Search 4', 'Live Search 5', 'Live Search 6', 'Live Search 7', 'Live Search 8', 'Live Search 9', 'Live Search 10'];
  sexe = ['B', 'F'];
  miini = ['dreptaci', 'stîngaci'];
  culori_butoane = ['beige', 'cadetblue', 'coral', 'cornflowerblue', 'darkseagreen', 'indianred', 'lightcoral', 'lightsteelblue', 'salmon', 'silver', 'tan', 'yellowgreen', 'thistle'];
  model = new Uzer();
  arata = true;
  ceva = "";

  //stare: any;
  constructor(private robSod: SodService, /*private robAuthorize: AuthorizeService,*/ private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {
    //this.robAuthorize.signIn(this.stare)/*ezoz*/.then(t => console.log(`stare:::`, t));//ezoz
    //this.stare.then((t:any) => console.log(`---stare::: ${t}`));//așa nu merge
  }

  
  ngOnInit(): void {//localStorage.removeItem("proaspat")//e ok codul//testarea am făcut-o rulînd cu removeItem decomentat și blocul if comentat, apoi o nouă rulare cu removeItem comentat și blocul if decomentat //am scris inițial în loc de "removeItem" "DeleteItem" și nu mi-o dat nicio eroare, da codul de după nu a mai mers
    if (localStorage.getItem("proaspat") === null)//localStorage nu merge în afara metodei. nici "let" nu merge în afara metodelor. erorile-s diferite. normal
    {
      localStorage.setItem("proaspat", "nu");
      this.formularProfilDiv.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });// scroll into view funcționează da nu știu să aduc top-ul elementului la top-ul ecranului(minus butoanele)// "The element may not be scrolled completely to the top or bottom depending on the layout of other elements" //poți testa umplînd div-ul "realizări" cu multe rînduri(cît să umple mai mult de înălțimea ecranui)
    }
    //this.isAuthenticated = this.robAuthorize.isAuthenticated();
    //this.userName = this.robAuthorize.getUser().pipe(map(u => u && u.name));
  }

  onSubmit() {
    let uzer = new Uzer()
    //uzer = this.heroForm.value//////////////////////////////////
    this.http.post<Uzer>(this.baseUrl + 'uzer', uzer).subscribe()
  }

  Sod(mina: any) {
    this.robSod.communicateMessage(mina);
  }

  Culoare(culoare: any) {
    this.model./*culoareButoane*/paleta = culoare;
    document.documentElement.style.setProperty('--culoare-butoane', culoare/*'lightcoral'*//*this.model.culoareButoane*/);
  }

  

}












//relative path: '../../sod.service'
//absolute path: 'src/app/sod.service'
