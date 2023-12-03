import { Inject, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

//import { MatDialog } from '@angular/material/dialog';

import { StripeService, StripePaymentElementComponent } from 'ngx-stripe';
import { StripeElementsOptions, PaymentIntent } from '@stripe/stripe-js';
//import { environment } from 'environments/environment';

import { AppComponent } from 'src/app/app.component'
import { ZhartaComponent } from 'src/app/harta/zharta/zharta.component'

@Component({
  selector: 'app-zplata',
  templateUrl: './zplata.component.html',
  styleUrls: ['./zplata.component.css']
})
export class ZplataComponent implements OnInit {
  @ViewChild(StripePaymentElementComponent)
  paymentElement: StripePaymentElementComponent;

  paymentElementForm = this.fb.group({
    locale: 'fr',//bm
    //name: ['John doe', [Validators.required]],
    //email: ['support@ngx-stripe.dev', [Validators.required]],
    //address: [''],
    //zipcode: [''],
    //city: [''],
    amount: [2500/*, [Validators.required, Validators.pattern(/d+/)]*/]
  });

  elementsOptions: StripeElementsOptions = {
    //locale: 'en',//cbm
    locale: 'fr',//bm
  };

  paying = false;

  constructor(
    @Inject('BASE_URL') private baseUrl: string,
    private http: HttpClient,
    private fb: FormBuilder,
    private stripeService: StripeService
  ) { }

  nimic = new Nimic
  procesareiframe = false
  ngOnInit() {
    this.procesareiframe = true
    this.http.post(this.baseUrl + 'plata/plateste', this.nimic)
      .subscribe((pi:any)=>{
        this.elementsOptions.clientSecret = pi.client_secret!
        this.procesareiframe = false
      })
  }

  plataOk
  eroarea
  procesareplata = false
  pay() {
    this.procesareplata = true
    if (this.paymentElementForm.valid) {
      this.paying = true;
      this.stripeService.confirmPayment({
        elements: this.paymentElement.elements,
        redirect: 'if_required'
      }).subscribe(result => {
        this.procesareplata = false
        this.paying = false;
        console.log('Result', result);
        if (result.error) {
          //alert({ success: false, error: result.error.message });// Show error to your customer (e.g., insufficient funds)
          this.plataOk = 'nu';// ; musai
          (document.getElementById('butonplatesc') as any).disabled = true
          /*if (result.error.message != 'Numărul cardului dvs. nu este valid.' ||
              result.error.message != 'Numărul cardului dvs. nu este complet.' || //Severity	Code	Description Error	TS2367(TS) This comparison appears to be unintentional because the types '"Numărul cardului dvs. nu este valid."' and '"Numărul cardului dvs. nu este complet."' have no overlap.
              result.error.message != 'Data de expirare a cardului dvs. nu este completă.' ||
              result.error.message != 'Codul de securitate al cardului dvs. nu este complet.') {//astea apar sub fielduri deci nu le mai arăt și eu
            this.eroarea = result.error.message
            console.log(result.error.message, " 111111111111111111111111111111")
          }*///nu merge cu mai multe or că nu înțeleg ce am greșit eu la logică așa că fac așa:
          if (result.error.message == 'Numărul cardului dvs. nu este valid.') {
            this.eroarea = ''
            console.log(result.error.message, " 111111111111111111111111111111")
          }
          else if (result.error.message == 'Numărul cardului dvs. nu este complet.') {
            this.eroarea = ''
            console.log(result.error.message, " 222222222222222222222222222222")
          }
          else if (result.error.message == 'Data de expirare a cardului dvs. nu este completă.') {
            this.eroarea = ''
            console.log(result.error.message, " 333333333333333333333333333333")
          }
          else if (result.error.message == 'Codul de securitate al cardului dvs. nu este complet.') {
            this.eroarea = ''
            console.log(result.error.message, " 444444444444444444444444444444")
          }
          else {
            this.eroarea = result.error.message
            console.log(result.error.message, " LLLLLLLLLLLLLLLLLLLLLLLLLLLLLL")
          }
        } else {
          if (result.paymentIntent.status === 'succeeded') {// The payment has been processed!
            //alert({ success: true });// Show a success message to your customer
            this.plataOk = 'Mulțumin!'
            this.http.get(this.baseUrl + 'plata/platit')//dacă ăsta cade? am luat banii omului da în db rămîne cu neplătiți
              .subscribe((s: any) => {
                console.log('-!-N-!-!-N-!-!-N-!-!-N-!-!-N-!-!-N-!-!-N-!-!-N-!-!-N-!-!-N-!-!-N-!-!-N-!-!-N-!-')
                if (s == null) {
                  console.log('NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN')
                }
                if (s != null) {
                  console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
                }
                let dmas = (document.getElementById('deplata-mare-sting') as any)
                if (dmas/*.style.display == 'inline-block'*/) {
                  (document.getElementById('deplata-mare-sting') as any).style.display = 'none'
                }
                let dmad = (document.getElementById('deplata-mare-drept') as any)
                if (dmad/*.style.display == 'inline-block'*/) {
                  (document.getElementById('deplata-mare-drept') as any).style.display = 'none'
                }
                let dmis = (document.getElementById('deplata-mic-sting') as any)
                if (dmis/*.style.display == 'inline-block'*/) {
                  (document.getElementById('deplata-mic-sting') as any).style.display = 'none'
                }
                let dmid = (document.getElementById('deplata-mic-drept') as any)
                if (dmid/*.style.display == 'inline-block'*/) {
                  (document.getElementById('deplata-mic-drept') as any).style.display = 'none'
                }
                //ZhartaComponent.map.removeLayer(ZhartaComponent.copaciiNoiLayer)
                //ZhartaComponent.map.removeLayer(ZhartaComponent.copaciiLayer)
                //this.http.get(this.baseUrl + 'uzer/uzer')
                  //.subscribe((s: any) => {

                    //ZhartaComponent.displayCopacii()//todo cu zoom si extent salvate
                  //})
              })
          }
        }
      });
    } else {
      console.log(this.paymentElementForm);
    }
  }

  copiaza(numid) {
    let numinel = document.getElementById(numid)!.innerHTML
    navigator.clipboard.writeText(numinel)
      .then(() => {
        console.log(`Copied text to clipboard: ${numinel}`)
        //alert(`Copied text to clipboard: ${numinel}`)
      })
      .catch((error) => {
        console.error(`Could not copy text: ${error}`)
      })
  }

  factura() {
    console.log("FFFFFFFFFFFFFFFFFF")
  }

  get getUzer() {
    return AppComponent.Uzer
  }
  get getContributia() {
    return AppComponent.contributia
  }

}

class Nimic {
}
