import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
//import { NavMenuComponent } from './nav-menu/nav-menu.component';
//import { HomeComponent } from './home/home.component';
//import { CounterComponent } from './counter/counter.component';
//import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { AuthorizeInterceptor } from 'src/api-authorization/authorize.interceptor';

import { ProfilComponent } from './profil/profil.component';
import { DespreComponent } from './despre/despre.component';
import { StatisticiComponent } from './statistici/statistici.component';
import { TopComponent } from './top/top.component';
import { PlanteazaComponent } from './harta/planteaza.component';
import { CautaComponent } from './harta/zharta/cauta/cauta.component';
import { ZprofilComponent } from './profil/zprofil/zprofil.component';
import { ZstatisticiComponent } from './statistici/zstatistici/zstatistici.component';
import { ZhartaComponent } from './harta/zharta/zharta.component';
import { ZtopComponent } from './top/ztop/ztop.component';
import { ZdespreComponent } from './despre/zdespre/zdespre.component';


@NgModule({
  declarations: [
    AppComponent,
    //NavMenuComponent,
    //HomeComponent,
    //CounterComponent,
    //FetchDataComponent
    ProfilComponent,
    DespreComponent,
    StatisticiComponent,
    TopComponent,
    PlanteazaComponent,
    //HartaComponent,
    CautaComponent,
    ZprofilComponent,
    ZstatisticiComponent,
    ZhartaComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      //{ path: '', component: HomeComponent, pathMatch: 'full' },
      //{ path: 'counter', component: CounterComponent },
      //{ path: 'fetch-data', component: FetchDataComponent },
      { path: '', component: ZhartaComponent, title: 'Rodăcini', pathMatch: 'full', /*redirectTo: 'autentificare'*/ },
      { path: 'profil', component: ZprofilComponent, title: 'Rodăcini - Profil',/* canActivate: [AuthorizeGuard],*/ /*redirectTo: 'autentificare'*/ },
      { path: 'statistici', component: ZstatisticiComponent, title: 'Rodăcini - Statistici' },
      { path: 'top', component: ZtopComponent, title: 'Rodăcini - Top' },
      { path: 'despre', component: ZdespreComponent, title: 'Rodăcini - Despre' },
    ], { scrollPositionRestoration: 'top' }/*nu merge în toate cazurile da mai bine decît nimic*/ )
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthorizeInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
