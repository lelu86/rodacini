import { Component, OnInit, Inject } from '@angular/core'
import { SodService } from 'src/app/0servicii/sod.service'
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ZhartaComponent } from 'src/app/harta/zharta/zharta.component'
import { AppComponent } from 'src/app/app.component'

import GeoJSON from 'ol/format/GeoJSON'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { Style, Icon, Text, Fill, Stroke } from 'ol/style';
import { Overlay } from 'ol';
import { easeOut } from 'ol/easing.js'


@Component({
  selector: 'app-zbo',
  templateUrl: './zbo.component.html',
  styleUrls: ['./zbo.component.css']
})
export class ZboComponent implements OnInit {

  cexpandat = 'nimic'
  mmmmVizibil = false

  constructor(private robSod: SodService,
    @Inject('BASE_URL') private baseUrl: string,
    private http: HttpClient) { }

  ecran
  sod: any
  mql = window.matchMedia("(max-width: 210mm)")
  ngOnInit(): void {
    this.robSod.sendMessage.subscribe((message) => {
      this.sod = message;
    })
    /*window.addEventListener('resize', ()=> {//păstrez ca exemplu pt eventuri, altele decît ăsta care fire tare rar, eventual pt eventuri finale
      console.log('screen.width')
      //nici cu interval de 100px nu detectează la viteză cît de cît mai mare de resize
      if (screen.width > 744 && screen.width < 844*//*> 210 * 3.7795275591*//*) {//793,700787411
        console.log(screen.width)
        this.mmmmVizibil = false
        this.cexpandat = 'nimic'
      }
    })*///sau window.onresize = function () { console.log(screen.width) }
    this.mql.addEventListener("change", (e)=> {//arrow function era o named function și mql era afară da în ng nu îi validă sintaxa
      if (e.matches) {
        this.ecran='mic'
        this.mmmmVizibil = false/* the viewport is 600 pixels wide or less */
        this.cexpandat = 'nimic'
        this.uatList = []//ca să nu se păstreze între ecrane și să apară la expandarea uat //locList nu trebe s-o golesc, nu-mi dau seama dc
      }
      else {
        this.ecran='mare'
        this.mmmmVizibil = false
        this.cexpandat = 'nimic'
        this.uatList = []//ca să nu se păstreze între ecrane și să apară la expandarea uat //locList nu trebe s-o golesc, nu-mi dau seama dc
      }
    })
    if (this.mql.matches) {//le: ca să verifice și după init nu doar la change, ceva de genu
      this.ecran = 'mic'
      this.mmmmVizibil = false/* the viewport is 600 pixels wide or less */
      this.cexpandat = 'nimic'
    }
    else {
      this.ecran = 'mare'
      this.mmmmVizibil = false
      this.cexpandat = 'nimic'
    }
  }

  eloc
  locList = [] as any[]//"TypeScript defines empty arrays ([]) as type never[]. That is an array that always will be empty. A bizarre thing of TS"
  locCauta(e) {
    if (e.target.value.length > 1) {//există "Ip", singura localitate din două litere
      (document.getElementById('aidi-refresh') as any).style.display = 'inline-block'
      this.http.post(this.baseUrl + 'zbo/loc', { numeproprietate: e.target.value })
        .subscribe((s: any) => {
          (document.getElementById('aidi-refresh') as any).style.display = 'none'
          console.log('###################################################################################')
          this.locList = JSON.parse(JSON.stringify(s))//nu se poate așa: "this.locList=s" și nicicum altcumva decît cu lodash dacă nu-i convertibil în json: https://stackoverflow.com/a/52046842
          for (let i = 0; i < s.length; i++) {
            for (let j = i+1; j < s.length; j++) {
              if (s[j].nume == s[i].nume) {
                this.locList[i].nume = s[i].nume + '@' + s[i].uat + '@' + s[i].judet
                this.locList[j].nume = s[j].nume + '@' + s[j].uat + '@' + s[j].judet
              }
            }
          }
          console.log(this.locList)
          console.log('###################################################################################')
          if (s.length < 1) {
            this.eloc = true
          }
        })
    }
    if (e.target.value.length<2) {
      this.locList = []
      this.eloc = false
    }
  }

  locZboara(locAleasa) {
    this.locList = []
    console.log('ZZZZZZZZZZZZZZZZZZ---Z---ZZZZZZZZZZZZZZZZZZZZZZZZZZZ')
    console.log(locAleasa)
    console.log('ZZZZZZZZZZZZZZZZZZ---Z---ZZZZZZZZZZZZZZZZZZZZZZZZZZZ')
    //epsg4326 to Epsg3857 și invers: https://stackoverflow.com/a/70201137
    let x = (locAleasa.xcoorEpsg4326Wgs84 * 20037508.34) / 180;
    let y = parseFloat(locAleasa.ycoorEpsg4326Wgs84) + 90;
    y = y * (Math.PI / 360);
    y = Math.tan(y);
    y = Math.log(y);
    y = y / (Math.PI / 180);
    y = (y * 20037508.34) / 180;
    //ZhartaComponent.view.animate({ zoom: 7/*exemplu ZhartaComponent.view.getZoom()!-11*/, duration: 5000 }, { center: [x, y], duration: 5000 }, { zoom: 14, duration: 5000 })//pstrez ca exemplu
    //ZhartaComponent.view.setCenter([x, y])
    ZhartaComponent.view.animate({zoom:ZhartaComponent.view.getZoom()!-1,duration:1000}, {center:[x,y]}, {zoom:14,duration:1000})//pe ecran mare nu animează nimic, prbabil pt că zoomul e 14 fix
  }

  euat
  uatList = [] as any[]
  uatCauta(e) {
    if (e.target.value.length > 1) {//există "Ip" și comună, singura comună din două litere
      (document.getElementById('aidi-refresh') as any).style.display = 'inline-block'
      this.http.post(this.baseUrl + 'zbo/uat', { numeproprietate: e.target.value })
        .subscribe((s: any) => {
          (document.getElementById('aidi-refresh') as any).style.display = 'none'
          console.log('###################################################################################')
          this.uatList = JSON.parse(JSON.stringify(s))//nu se poate așa: "this.uatList=s" și nicicum altcumva decît cu lodash dacă nu-i convertibil în json: https://stackoverflow.com/a/52046842
          for (let i = 0; i < s.length; i++) {
            for (let j = i + 1; j < s.length; j++) {
              if (s[j].nume == s[i].nume) {
                this.uatList[i].arondat = s[i].nume + '@' + s[i].judet
                this.uatList[j].arondat = s[j].nume + '@' + s[j].judet
                //this.uatList[i].nume = s[i].nume + '@' + s[i].judet
                //this.uatList[j].nume = s[j].nume + '@' + s[j].judet
              }
            }
          }
          console.log(this.uatList)
          console.log('###################################################################################')
          if (s.length<1) {
            this.euat = true
          }
        })
    }
    if (e.target.value.length < 2) {
      this.uatList = []
      this.euat = false
    }
  }

  uatZboara(uatAleasa) {
    this.uatList = []
    console.log('NJNJ----NJNJ----NJNJ----NJNJ----NJNJ----NJNJ----NJNJ----NJNJ----NJNJ----NJNJ----NJNJ----NJNJ----')
    console.log(uatAleasa.nume)
    console.log(uatAleasa.judet)
    console.log('NJNJ----NJNJ----NJNJ----NJNJ----NJNJ----NJNJ----NJNJ----NJNJ----NJNJ----NJNJ----NJNJ----NJNJ----')
    this.http.post(this.baseUrl + 'zbo/uataleasa', { numeproprietatenume: uatAleasa.nume, numeproprietatejudet: uatAleasa.judet })
      .subscribe((s: any) => {
        console.log('DDD---DDD---DDD---DDD---DDD---DDD---DDD---DDD---DDD---DDD---DDD---DDD---DDD---DDD---DDD---DDD---')
        console.log(s)
        console.log('DDD---DDD---DDD---DDD---DDD---DDD---DDD---DDD---DDD---DDD---DDD---DDD---DDD---DDD---DDD---DDD---')
        let sursaGeojson =
          `
          {
          "type": "FeatureCollection",
          "name": "ro_uat_poligon-uatAleasa",
          "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
          "features":
            [
              { "type": "Feature", "properties": { "name": "Năsturelu", "natLevName": "Comuna", "county": "Teleorman" }, "geometry": {
                ${s[0].poligon}
              } }
            ]
          }
          `
        let uatAleasaLayer = new VectorLayer({
          source: new VectorSource({
            url: 'data:,' + encodeURIComponent(sursaGeojson),
            format: new GeoJSON(),
          }),
          style: new Style({
            fill: new Fill({
              color: 'rgba(55, 155, 55, 0.0)'
            }),
            stroke: new Stroke({
              color: 'cyan',
              lineDash: [3.14],
              width: 3.7795275591 / 2
            }),
          }),
        })
        ZhartaComponent.map.addLayer(uatAleasaLayer)
        ZhartaComponent.map.once('loadend', () => {
          let uatFeatures = uatAleasaLayer.getSource()!.getFeatures()
          if (this.ecran == 'mic') {
            ZhartaComponent.view.fit(uatFeatures[0].getGeometry()!.getExtent(), { padding: [12 * 3.7795275591, 0, 12 * 3.7795275591, 0] })// -y, -x, +y, +x
          }
          else {
            ZhartaComponent.view.fit(uatFeatures[0].getGeometry()!.getExtent(), { padding: [24 * 3.7795275591, 0, 24 * 3.7795275591, 0] })
          }
        })
      })
  }

  epar
  para
  parCauta(e) {
    let featuri = ZhartaComponent.parceasLayer.getSource()!.getFeatures()
    if (/*typeof numar == 'number' &&*/ e.target.value > 0 && e.target.value <= featuri.length) {
      for (var i of featuri) {
        if (i.get('număr') == e.target.value) {
          this.para = i
          console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@---PARA---@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
          console.log(this.para)
          console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@---PARA---@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
          if (i.get('gata') == 'da') {
            //console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@parcelă încheiată@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
            //this.para = i
          }
          if (i.get('gata') == 'nu') {
            //this.para = i
          }
        }
      }
    }
    else {
      this.epar = true
      this.para = null
    }
    if (!e.target.value) {
      this.epar = false
    }
  }

  parZboara() {
    if (this.ecran == 'mic') {
      ZhartaComponent.view.fit(this.para.getGeometry()!.getExtent(), { padding: [12 * 3.7795275591, 0, 12 * 3.7795275591, 0] })// -y, -x, +y, +x
    }
    else {
      ZhartaComponent.view.fit(this.para.getGeometry()!.getExtent(), { padding: [24 * 3.7795275591, 0, 24 * 3.7795275591, 0] })
    }
    var grosime = (3.7795275591 / 2)*10
    function stilf() {
      grosime = grosime - (3.7795275591 / 2)
      return new Style({
        fill: new Fill({
          color: 'rgba(55, 155, 55, 0.0)'
        }),
        stroke: new Stroke({
          color: 'rgba(192, 0, 0, 1.0)',
          width: grosime
        }),
      })
    }
    function stilf2() {
      grosime = grosime - (3.7795275591 / 2)
      return new Style({
        fill: new Fill({
          color: 'rgba(55, 155, 55, 0.5)'//nu vreau fill dar e singura soluție să diferențiez o parcelă gata (care vreau să aibă stroke z-index mai mic decît cele în lucru) înconjurată de parcele în lucru
        }),
        stroke: new Stroke({
          color: 'rgba(0, 192, 0, 1.0)',
          width: grosime
        }),
      })
    }
    let featuri = ZhartaComponent.parceasLayer.getSource()!.getFeatures()
    for (let i of featuri) {
      if (i == this.para) {
        let intervalul = setInterval(() => {
          if (i.get('gata') == 'nu') {
            i.setStyle(stilf())
          }
          if (i.get('gata') == 'da') {
            i.setStyle(stilf2())
          }
          if (grosime < (3.7795275591 / 2)*2) {
            clearInterval(intervalul)
          }
        }, 16.666*7.654321)
      }
    }
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////\\\\\\\\\\\\\\\\\
  ecooAfara; ecooInvalid
  cooa: any = { nord: undefined, est: undefined }//musai cooa declarat any altfel devine undefined și nu pot asigna mai încolo la undefined
  cooCauta(e) {
    // ^([-+]?\\d{1,2}([.]\\d+)?),\\s*([-+]?\\d{1,3}([.]\\d+)?)$ // 41.40338, 2.17403
    // ^(\\()([-+]?)([\\d]{1,2})(((\\.)(\\d+)(,)))(\\s*)(([-+]?)([\\d]{1,3})((\\.)(\\d+))?(\\)))$ // (99.000, 122.000)
    // ^-?[0-9]{1,3}(?:\\.[0-9]{1,10})? -?[0-9]{1,3}(?:\\.[0-9]{1,10})?$ // 41.40338 2.17403 // -41.40338 -2.17403 // -41,40338 -2.17403 // -41,40338 -2,17403
    var pattern = new RegExp('^-?[0-9]{1,3}(?:[\\.\\,][0-9]{1,10})? -?[0-9]{1,3}(?:[\\.\\,][0-9]{1,10})?$')//doar așa merge, varianta const re = /ab+c/; nu, chiar dacă ar trebui https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions
    //45,5995641 24,7361706 //45.5995641 24.7361706 //45.5995641, 24.7361706
    if (pattern.test(e.target.value) == true) {//e.target.value
      let r = e.target.value.replace(/\,/g, '.')
      let s = r.split(' ')
      let sn = s[0]//surpiză plăcută, le detectează ca number
      let se = s[1]
      console.log('#########################################################################################')
      console.log('#########################################################################################')
      console.log('#########################################################################################')
      console.log(sn)
      console.log(se)
      console.log('#########################################################################################')
      console.log('#########################################################################################')
      console.log('#########################################################################################')
      let x = (se * 20037508.34) / 180;
      let y = parseFloat(sn) + 90;
      y = y * (Math.PI / 360);
      y = Math.tan(y);
      y = Math.log(y);
      y = y / (Math.PI / 180);
      y = (y * 20037508.34) / 180;
      let fs=ZhartaComponent.granitaLayer.getSource()!.getFeatures()
      console.log('RO---RO---RO---RO---RO---RO---RO---RO---RO---RO---RO---RO---RO---RO---RO---RO---RO---RO---RO---')
      //console.log(ZhartaComponent.granitaLayer.getSource()!)
      //console.log(ZhartaComponent.granitaLayer.getSource()!.getFeaturesAtCoordinate([x, y]))
      //console.log(ZhartaComponent.granitaLayer.getSource()!.getFeaturesAtCoordinate([x, y]).length > 0)
      console.log(fs)
      console.log([fs[0]])
      console.log('RO---RO---RO---RO---RO---RO---RO---RO---RO---RO---RO---RO---RO---RO---RO---RO---RO---RO---RO---')
      if (fs[0].getGeometry()!.intersectsCoordinate([x, y])) {//sau if(ZhartaComponent.granitaLayer.getSource()!.getFeaturesAtCoordinate([x,y]).length>0)
        this.cooa.nord = y
        this.cooa.est = x
      }
      else {
        this.ecooInvalid = false
        this.ecooAfara = true
      }
    }
    else {
      this.cooa.nord = undefined
      this.cooa.est = undefined
      this.ecooAfara = false
      this.ecooInvalid = true
    }
    if (!e.target.value) {
      this.ecooAfara = false
      this.ecooInvalid = false
    }
  }

  cooZboara() {//If you do not explicitly set one, your map is going to use our default which is the Web Mercator projection (EPSG:3857)
    ZhartaComponent.view.animate({ zoom: ZhartaComponent.view.getZoom()! - 1, duration: 1000 }, { center: [this.cooa.est!, this.cooa.nord!], duration: 0 }, { zoom: 14, duration: 1000 })
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////\\\\\\\\\\\\\\\\\

  onLoc(id) {
    if (this.cexpandat != 'nimic' && this.cexpandat != id) {
      if (id == 'midLoc') {
        document.getElementById(this.cexpandat)!.style.cssText = 'width:calc(((100vw - 24mm) / 2) - 2mm); border-top-right-radius:4mm; border-bottom-right-radius:4mm'
      }
      if (id == 'madLoc') {
        document.getElementById(this.cexpandat)!.style.cssText = 'width:calc(((100vw - 48mm) / 4) - 2mm); border-top-left-radius:4mm; border-bottom-left-radius:4mm'
      }
      if (id == 'misLoc') {
        document.getElementById(this.cexpandat)!.style.cssText = 'width:calc(((100vw - 24mm) / 2) - 2mm); border-top-left-radius:4mm; border-bottom-left-radius:4mm'
      }
      if (id == 'masLoc') {
        document.getElementById(this.cexpandat)!.style.cssText = 'width:calc(((100vw - 48mm) / 4) - 2mm); border-top-right-radius:4mm; border-bottom-right-radius:4mm'
      }
    }
    if (id == 'midLoc') {
      document.getElementById(id)!.style.cssText = 'width:calc(((100vw - 24mm) / 1) - 2mm); border-top-right-radius:4mm; border-bottom-right-radius:4mm'
    }
    if (id == 'madLoc') {
      document.getElementById(id)!.style.cssText = 'width:calc(((100vw - 48mm) / 2) - 2mm); border-top-left-radius:4mm; border-bottom-left-radius:4mm; transform:translateX( calc(-1 *((100vw - 48mm) / 4)) )'
    }
    if (id == 'misLoc') {
      document.getElementById(id)!.style.cssText = 'width:calc(((100vw - 24mm) / 1) - 2mm); border-top-left-radius:4mm; border-bottom-left-radius:4mm; transform:translateX( calc(-1 *((100vw - 24mm) / 2)) )'
    }
    if (id == 'masLoc') {
      document.getElementById(id)!.style.cssText = 'width:calc(((100vw - 48mm) / 2) - 2mm); border-top-right-radius:4mm; border-bottom-right-radius:4mm'
    }
    this.cexpandat=id
  }

  onUat(id) {
    if (this.cexpandat != 'nimic' && this.cexpandat != id) {
      if (id == 'midUat') {
        document.getElementById(this.cexpandat)!.style.cssText = 'width:calc(((100vw - 24mm) / 2) - 2mm); border-top-right-radius:4mm; border-bottom-right-radius:4mm'
      }
      if (id == 'madUat') {
        document.getElementById(this.cexpandat)!.style.cssText = 'width:calc(((100vw - 48mm) / 4) - 2mm); border-top-left-radius:4mm; border-bottom-left-radius:4mm'
      }
      if (id == 'misUat') {
        document.getElementById(this.cexpandat)!.style.cssText = 'width:calc(((100vw - 24mm) / 2) - 2mm); border-top-left-radius:4mm; border-bottom-left-radius:4mm'
      }
      if (id == 'masUat') {
        document.getElementById(this.cexpandat)!.style.cssText = 'width:calc(((100vw - 48mm) / 4) - 2mm); border-top-right-radius:4mm; border-bottom-right-radius:4mm'
      }
    }
    if (id == 'midUat') {
      document.getElementById(id)!.style.cssText = 'width:calc(((100vw - 24mm) / 1) - 2mm); border-top-right-radius:4mm; border-bottom-right-radius:4mm'
    }
    if (id == 'madUat') {
      document.getElementById(id)!.style.cssText = 'width:calc(((100vw - 48mm) / 2) - 2mm); border-top-left-radius:4mm; border-bottom-left-radius:4mm; transform:translateX( calc(-1 *((100vw - 48mm) / 4)) )'
    }
    if (id == 'misUat') {
      document.getElementById(id)!.style.cssText = 'width:calc(((100vw - 24mm) / 1) - 2mm); border-top-left-radius:4mm; border-bottom-left-radius:4mm; transform:translateX( calc(-1 *((100vw - 24mm) / 2)) )'
    }
    if (id == 'masUat') {
      document.getElementById(id)!.style.cssText = 'width:calc(((100vw - 48mm) / 2) - 2mm); border-top-right-radius:4mm; border-bottom-right-radius:4mm'
    }
    this.cexpandat = id
  }

  onPar(id) {
    if (this.cexpandat != 'nimic' && this.cexpandat != id) {
      if (id == 'midPar') {
        document.getElementById(this.cexpandat)!.style.cssText = 'width:calc(((100vw - 24mm) / 2) - 2mm); border-top-right-radius:4mm; border-bottom-right-radius:4mm'
      }
      if (id == 'madPar') {
        document.getElementById(this.cexpandat)!.style.cssText = 'width:calc(((100vw - 48mm) / 4) - 2mm); border-top-left-radius:4mm; border-bottom-left-radius:4mm'
      }
      if (id == 'misPar') {
        document.getElementById(this.cexpandat)!.style.cssText = 'width:calc(((100vw - 24mm) / 2) - 2mm); border-top-left-radius:4mm; border-bottom-left-radius:4mm'
      }
      if (id == 'masPar') {
        document.getElementById(this.cexpandat)!.style.cssText = 'width:calc(((100vw - 48mm) / 4) - 2mm); border-top-right-radius:4mm; border-bottom-right-radius:4mm'
      }
    }
    if (id == 'midPar') {
      document.getElementById(id)!.style.cssText = 'width:calc(((100vw - 24mm) / 1) - 2mm); border-top-right-radius:4mm; border-bottom-right-radius:4mm'
    }
    if (id == 'madPar') {
      document.getElementById(id)!.style.cssText = 'width:calc(((100vw - 48mm) / 2) - 2mm); border-top-left-radius:4mm; border-bottom-left-radius:4mm; text-indent:9mm; transform:translateX( calc(-1 *((100vw - 48mm) / 4)) )'
    }
    if (id == 'misPar') {
      document.getElementById(id)!.style.cssText = 'width:calc(((100vw - 24mm) / 1) - 2mm); border-top-left-radius:4mm; border-bottom-left-radius:4mm; text-indent:9mm; transform:translateX( calc(-1 *((100vw - 24mm) / 2)) )'
    }
    if (id == 'masPar') {
      document.getElementById(id)!.style.cssText = 'width:calc(((100vw - 48mm) / 2) - 2mm); border-top-right-radius:4mm; border-bottom-right-radius:4mm'
    }
    this.cexpandat = id
  }

  onCoo(id) {
    if (this.cexpandat != 'nimic' && this.cexpandat != id) {
      if (id == 'midCoo') {
        document.getElementById(this.cexpandat)!.style.cssText = 'width:calc(((100vw - 24mm) / 2) - 2mm); border-top-right-radius:4mm; border-bottom-right-radius:4mm'
      }
      if (id == 'madCoo') {
        document.getElementById(this.cexpandat)!.style.cssText = 'width:calc(((100vw - 48mm) / 4) - 2mm); border-top-left-radius:4mm; border-bottom-left-radius:4mm'
      }
      if (id == 'misCoo') {
        document.getElementById(this.cexpandat)!.style.cssText = 'width:calc(((100vw - 24mm) / 2) - 2mm); border-top-left-radius:4mm; border-bottom-left-radius:4mm'
      }
      if (id == 'masCoo') {
        document.getElementById(this.cexpandat)!.style.cssText = 'width:calc(((100vw - 48mm) / 4) - 2mm); border-top-right-radius:4mm; border-bottom-right-radius:4mm'
      }
    }
    if (id == 'midCoo') {
      document.getElementById(id)!.style.cssText = 'width:calc(((100vw - 24mm) / 1) - 2mm); border-top-right-radius:4mm; border-bottom-right-radius:4mm'
    }
    if (id == 'madCoo') {
      document.getElementById(id)!.style.cssText = 'width:calc(((100vw - 48mm) / 2) - 2mm); border-top-left-radius:4mm; border-bottom-left-radius:4mm; text-indent:9mm; transform:translateX( calc(-1 *((100vw - 48mm) / 4)) )'
    }
    if (id == 'misCoo') {
      document.getElementById(id)!.style.cssText = 'width:calc(((100vw - 24mm) / 1) - 2mm); border-top-left-radius:4mm; border-bottom-left-radius:4mm; text-indent:9mm; transform:translateX( calc(-1 *((100vw - 24mm) / 2)) )'
    }
    if (id == 'masCoo') {
      document.getElementById(id)!.style.cssText = 'width:calc(((100vw - 48mm) / 2) - 2mm); border-top-right-radius:4mm; border-bottom-right-radius:4mm'
    }
    this.cexpandat = id
  }

  masClick = false
  misClick = false
  madClick = false
  midClick = false
  clickat(b) {
    console.log('CCC---CCC---CCC---CCC---CCC---CCC---CCC---CCC---CCC---CCC---CCC---CCC---CCC---CCC---CCC---CCC---CCC---')
    this.locList = []
    if (b == 'mas') {
      this.masClick = true
      this.misClick = false
      this.madClick = false
      this.midClick = false
    }
    if (b == 'mis') {
      this.masClick = false
      this.misClick = true
      this.madClick = false
      this.midClick = false
    }
    if (b == 'mad') {
      this.masClick = false
      this.misClick = false
      this.madClick = true
      this.midClick = false
    }
    if (b == 'mid') {
      this.masClick = false
      this.misClick = false
      this.madClick = false
      this.midClick = true
    }
  }

  get getUzer() {
    return AppComponent.Uzer
  }

}
