import { Component } from '@angular/core';
import { expand } from 'rxjs';

import { AppComponent } from 'src/app/app.component'

@Component({
  selector: 'app-enhuro',
  templateUrl: './enhuro.component.html',
  styleUrls: ['./enhuro.component.css']
})
export class EnhuroComponent {

  ngOnInit() {
    document.getElementById('enhuro')!.style.transform = 'translateX(-6mm)'
    if (AppComponent.Uzer.limba == 'en') {
      //document.getElementById('en')!.style.transform = 'translateX(-6mm)'
      document.getElementById('hu')!.style.display = 'none'
      document.getElementById('ro')!.style.display = 'none'
    }
    if (AppComponent.Uzer.limba == 'hu') {
      document.getElementById('en')!.style.display = 'none'
      //document.getElementById('hu')!.style.transform = 'translateX(-6mm)'
      document.getElementById('ro')!.style.display = 'none'
    }
    if (AppComponent.Uzer.limba == 'ro') {
      document.getElementById('en')!.style.display = 'none'
      document.getElementById('hu')!.style.display = 'none'
      //document.getElementById('ro')!.style.transform = 'translateX(-6mm)'
    }
    window.addEventListener('click', /*function*/(e) => {
      if (AppComponent.Uzer.mina == 'stingaci') {
        //document.getElementById('enhuro')!.style.right = '0%'
        //document.getElementById('enhuro')!.style.transform = 'scaleX(-1) translateX(-6mm)'

        var en = document.getElementById('en')
        if (!((e.target as HTMLElement).closest("#en")) && AppComponent.Uzer.limba == 'en' && this.expandat == true) {
          document.getElementById('enhuro')!.style.transform = 'scaleX(-1) translateX(-6mm)'
          en!.style.display = 'inline-block'
          //en!.style.transform = 'scaleX(-1) translateX(-6mm)'
          document.getElementById('hu')!.style.display = 'none'
          document.getElementById('ro')!.style.display = 'none'
          this.expandat = false
        }
        var hu = document.getElementById('hu')
        if (!((e.target as HTMLElement).closest("#hu")) && AppComponent.Uzer.limba == 'hu' && this.expandat == true) {
          document.getElementById('enhuro')!.style.transform = 'scaleX(-1) translateX(-6mm)'
          document.getElementById('en')!.style.display = 'none'
          hu!.style.display = 'inline-block'
          //hu!.style.transform = 'scaleX(-1) translateX(-6mm)'
          document.getElementById('ro')!.style.display = 'none'
          this.expandat = false
        }
        var ro = document.getElementById('ro')
        if (!((e.target as HTMLElement).closest("#ro")) && AppComponent.Uzer.limba == 'ro' && this.expandat == true) {
          document.getElementById('enhuro')!.style.transform = 'scaleX(-1) translateX(-6mm)'
          document.getElementById('en')!.style.display = 'none'
          document.getElementById('hu')!.style.display = 'none'
          ro!.style.display = 'inline-block'
          document.getElementById('ropic')!.style.rotate = '0deg'
          //ro!.style.transform = 'scaleX(-1) translateX(-6mm)'
          this.expandat = false
        }

      }//////////////////////////////////////////////////////////////!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      var en = document.getElementById('en')
      if (!((e.target as HTMLElement).closest("#en")) && AppComponent.Uzer.limba == 'en' && this.expandat == true) {
        document.getElementById('enhuro')!.style.transform = 'translateX(-6mm)'
        en!.style.display = 'inline-block'
        //en!.style.transform = 'translateX(-6mm)'
        document.getElementById('hu')!.style.display = 'none'
        document.getElementById('ro')!.style.display = 'none'
        this.expandat = false
      }
      var hu = document.getElementById('hu')
      if (!((e.target as HTMLElement).closest("#hu")) && AppComponent.Uzer.limba == 'hu' && this.expandat == true) {
        document.getElementById('enhuro')!.style.transform = 'translateX(-6mm)'
        document.getElementById('en')!.style.display = 'none'
        hu!.style.display = 'inline-block'
        //hu!.style.transform = 'translateX(-6mm)'
        document.getElementById('ro')!.style.display = 'none'
        this.expandat = false
      }
      var ro = document.getElementById('ro')
      if (!((e.target as HTMLElement).closest("#ro")) && AppComponent.Uzer.limba == 'ro' && this.expandat == true) {
        document.getElementById('enhuro')!.style.transform = 'translateX(-6mm)'
        document.getElementById('en')!.style.display = 'none'
        document.getElementById('hu')!.style.display = 'none'
        ro!.style.display = 'inline-block'
        document.getElementById('ropic')!.style.rotate = '0deg'
        //ro!.style.transform = 'translateX(-6mm)'
        this.expandat = false
      }
    })
  }
  
  expandat=false
  limba(limba) {
    if (this.expandat == false) {
      if (AppComponent.Uzer.mina == 'stingaci') {
        console.log('SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS')
        document.getElementById('enhuro')!.style.right = '0%'
        document.getElementById('enhuro')!.style.transform = 'scaleX(-1) translateX(0mm)'
        document.getElementById('en')!.style.display = 'inline-block'
        document.getElementById('enpic')!.style.rotate = '360deg'
        document.getElementById('hu')!.style.display = 'inline-block'
        document.getElementById('hupic')!.style.rotate = '360deg'
        document.getElementById('ro')!.style.display = 'inline-block'
        document.getElementById('ropic')!.style.rotate = '270deg'
        this.expandat = true
        return
      }
      document.getElementById('enhuro')!.style.transform = 'translateX(0mm)'
      document.getElementById('en')!.style.display = 'inline-block'
      //document.getElementById('en')!.style.transform = 'translateX(0mm)'
      document.getElementById('enpic')!.style.rotate = '360deg'
      document.getElementById('hu')!.style.display = 'inline-block'
      //document.getElementById('hu')!.style.transform = 'translateX(0mm)'
      document.getElementById('hupic')!.style.rotate = '360deg'
      document.getElementById('ro')!.style.display = 'inline-block'
      //document.getElementById('ro')!.style.transform = 'translateX(0mm)'
      document.getElementById('ropic')!.style.rotate = '270deg'
      this.expandat = true
      return
    }
    if (this.expandat == true) {
      if (AppComponent.Uzer.mina == 'stingaci') {
        document.getElementById('enhuro')!.style.transform = 'scaleX(-1) translateX(-6mm)'
        AppComponent.Uzer.limba = limba
        if (AppComponent.Uzer.limba /*!*/ == 'en') {
          document.getElementById('en')!.style.display = 'inline-block'
          //document.getElementById('en')!.style.transform = 'translateX(-6mm)'
          document.getElementById('hu')!.style.display = 'none'
          document.getElementById('ro')!.style.display = 'none'
          this.expandat = false
        }
        if (AppComponent.Uzer.limba /*!*/ == 'hu') {
          document.getElementById('en')!.style.display = 'none'
          document.getElementById('hu')!.style.display = 'inline-block'
          //document.getElementById('hu')!.style.transform = 'translateX(-6mm)'
          document.getElementById('ro')!.style.display = 'none'
          this.expandat = false
        }
        if (AppComponent.Uzer.limba /*!*/ == 'ro') {
          document.getElementById('en')!.style.display = 'none'
          document.getElementById('hu')!.style.display = 'none'
          document.getElementById('ro')!.style.display = 'inline-block'
          //document.getElementById('ro')!.style.transform = 'translateX(-6mm)'
          document.getElementById('ropic')!.style.rotate = '0deg'
          this.expandat = false
        }
        return
      }
      document.getElementById('enhuro')!.style.transform = 'translateX(-6mm)'
      AppComponent.Uzer.limba = limba
      if (AppComponent.Uzer.limba /*!*/== 'en') {
        document.getElementById('en')!.style.display = 'inline-block'
        //document.getElementById('en')!.style.transform = 'translateX(-6mm)'
        document.getElementById('hu')!.style.display = 'none'
        document.getElementById('ro')!.style.display = 'none'
        this.expandat = false
      }
      if (AppComponent.Uzer.limba /*!*/== 'hu' ) {
        document.getElementById('en')!.style.display = 'none'
        document.getElementById('hu')!.style.display = 'inline-block'
        //document.getElementById('hu')!.style.transform = 'translateX(-6mm)'
        document.getElementById('ro')!.style.display = 'none'
        this.expandat = false
      }
      if (AppComponent.Uzer.limba /*!*/== 'ro') {
        document.getElementById('en')!.style.display = 'none'
        document.getElementById('hu')!.style.display = 'none'
        document.getElementById('ro')!.style.display = 'inline-block'
        //document.getElementById('ro')!.style.transform = 'translateX(-6mm)'
        document.getElementById('ropic')!.style.rotate = '0deg'
        this.expandat = false
      }
    }
  }

  get getUzer() {
    console.log(AppComponent.Uzer, 'LCLCLCLCLCLCLCLLCLCLCLCLCLCLCLLCLC')
    return AppComponent.Uzer
  }
  get getUzerState() {
    return AppComponent.UzerState
  }

}
