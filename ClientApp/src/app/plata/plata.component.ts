import { Inject, Component, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { HttpClient } from '@angular/common/http'

import { StripeService, StripePaymentElementComponent } from 'ngx-stripe'
import { StripeElementsOptions, PaymentIntent } from '@stripe/stripe-js'

import { SodService } from 'src/app/0servicii/sod.service'

import { AppComponent } from 'src/app/app.component'


@Component({
  selector: 'app-plata',
  templateUrl: './plata.component.html',
  styleUrls: ['./plata.component.css']
})
export class PlataComponent  {
  sod: any
  constructor(private robSod: SodService) {
    this.robSod.sendMessage.subscribe((message) => { this.sod = message; })
  }

  get getUzer() {
    return AppComponent.Uzer
  }
  get getContributia() {
    return AppComponent.contributia
  }
}

