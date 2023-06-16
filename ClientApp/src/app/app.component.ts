import { Component } from '@angular/core';
import { Observable } from 'rxjs';//bm
//import { AuthorizeService } from 'src/api-authorization/authorize.service';//bm

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'app';
  public isAuthenticated?: Observable<boolean>;//bm
  //constructor(private robAuthorize: AuthorizeService) { }//bm

  ngOnInit(): void {
    //this.isAuthenticated = this.robAuthorize.isAuthenticated();
  }//bm
}
