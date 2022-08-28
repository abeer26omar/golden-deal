import { Platform } from '@angular/cdk/platform';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MacPrefixService {
  macphone: boolean = false;
  macsearch: boolean = false;
  backdrop: boolean = true;

  constructor(private platform: Platform) {
    this.detectBrowser()
    this.operatingSysDetect()
   }
  detectBrowser(){
    const agent = window.navigator.userAgent.toLowerCase()
    switch (true) {
      case agent.indexOf('edge') > -1:
        return 'edge';
      case agent.indexOf('opr') > -1 && !!(<any>window).opr:
        return 'opera';
      case agent.indexOf('chrome') > -1 && !!(<any>window).chrome:
        // this.mac = true;
        return 'chrome';
      case agent.indexOf('trident') > -1:
        return 'ie';
      case agent.indexOf('firefox') > -1:
        this.macphone = true;
        this.macsearch = true;
        return 'firefox';
      case agent.indexOf('safari') > -1:
        this.macphone = true;
        this.macsearch = true;
        return 'safari';
      default:
        return 'other';
    }
  }
  operatingSysDetect(){      
    const agent = window.navigator.userAgent.toLowerCase()
    if ((window.navigator.userAgent.indexOf("Mac") != -1) && (agent.indexOf('safari') != -1)){
      this.macphone = true;
      this.macsearch = true;
    } 
    if(this.platform.IOS){
      this.backdrop = false
    }
  }
}
