import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Products} from '../models/products.model';
declare var window: any;



@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
 public data: Array<Products> = [];
 key: string = '';
 mac: boolean= false;
  constructor(private route: Router) { }
    
  ngOnInit() {
    this.operatingSysDetect();
    this.detectBrowser();    
  }

  search(name: any){
    this.key = name.target.value;
  }
  goLittleRockStar(){
    this.route.navigate(['/new-add'])
  }
  getSearchResult(){
    this.route.navigate([`/search-result`,{key: this.key}])
  }
  detectBrowser(){
    const agent = window.navigator.userAgent.toLowerCase()
    switch (true) {
      case agent.indexOf('edge') > -1:
        return 'edge';
      case agent.indexOf('opr') > -1 && !!(<any>window).opr:
        return 'opera';
      case agent.indexOf('chrome') > -1 && !!(<any>window).chrome:
        return 'chrome';
      case agent.indexOf('trident') > -1:
        return 'ie';
      case agent.indexOf('firefox') > -1:
        this.mac =  true;
        return 'firefox';
      case agent.indexOf('safari') > -1:
        this.mac =  true;
        return 'safari';

      default:
        return 'other';
    }
  }
  operatingSysDetect(){    
    const agent = window.navigator.userAgent.toLowerCase()
    if (window.navigator.userAgent.indexOf("Mac") != -1 && (agent.indexOf('chrome') > -1 && !!(<any>window).chrome)) {
      console.log("OS is Mac/iOS");
      this.mac =  true;
    } else{
      this.mac =  false;
    } 
  }
}
