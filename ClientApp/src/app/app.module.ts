import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { NgxStripeModule } from 'ngx-stripe'

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
import { EnhuroComponent } from './enhuro/enhuro.component';
import { PlataComponent } from './plata/plata.component';
import { ZplataComponent } from './plata/zplata/zplata.component';
import { ZboComponent } from './harta/zharta/zbo/zbo.component';
import { LayComponent } from './harta/zharta/lay/lay.component';
import { StsComponent } from './harta/zharta/sts/sts.component';

@NgModule({
  declarations: [
    CautaComponent,
    //HartaComponent,
    AppComponent,
    PlanteazaComponent,
    ProfilComponent,
    StatisticiComponent,
    TopComponent,
    DespreComponent,
    ZprofilComponent,//comentat zice: error NG8002: Can't bind to 'state' since it isn't a known property of 'button' //deci ar fi bine toate în declarations
    ZhartaComponent,
    ZstatisticiComponent,
    ZtopComponent,//comentat zice cant bind to *ngIf...
    ZdespreComponent, EnhuroComponent, PlataComponent, ZplataComponent, ZboComponent, LayComponent, StsComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxStripeModule.forRoot('pk_test_51NuG4sIvOzFkCYHSxtYEbvLDX30rPtMGtZabbJ1iNVZdozxaaZjTE2jXGBY4VtMb44fAK2j0BFwWY5uvfA4yHT7w000HXryBpF'),
    RouterModule.forRoot([
      { path: '', component: ZhartaComponent, title: 'Rodăcini', /*pathMatch: 'full',*/ /*redirectTo: 'autentificare'*/ },
      { path: 'profil', component: ZprofilComponent, title: 'Rodăcini - Profil',/* canActivate: [AuthorizeGuard],*/ /*redirectTo: 'autentificare'*/ },
      { path: 'statistici', component: ZstatisticiComponent, title: 'Rodăcini - Statistici' },
      { path: 'top', component: ZtopComponent, title: 'Rodăcini - Top' },
      { path: 'despre', component: ZdespreComponent, title: 'Rodăcini - Despre' },
      { path: 'plata', component: ZplataComponent, title: 'Rodăcini - Plata' },
    ], { scrollPositionRestoration: 'top' }/*nu merge în toate cazurile da mai bine decît nimic*/ )
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthorizeInterceptor, multi: true } 
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
