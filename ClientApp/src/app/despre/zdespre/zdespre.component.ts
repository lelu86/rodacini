import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AppComponent, Uzer} from 'src/app/app.component'


@Component({
  selector: 'app-zdespre',
  templateUrl: './zdespre.component.html',
  styleUrls: ['./zdespre.component.scss']
})
export class ZdespreComponent implements OnInit {
  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

  ngOnInit(): void {
  }

  get getUzer() {    
    return AppComponent.Uzer
  }
  get getContributia() {
    return AppComponent.contributia
  }

}
