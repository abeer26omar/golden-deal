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
    this.fnBrowserDetect();
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
  fnBrowserDetect(){      
    let userAgent = navigator.userAgent;
    let browserName;
      
      if(userAgent.match(/safari/i)){
        browserName = "safari";
        
      } else {        
      }
      
      if (window.navigator.userAgent.indexOf("Mac") != -1) {
        console.log("OS is Mac/iOS");
        this.mac =  true;

      } else{
        console.log('fgfhdh')
        this.mac =  false;
      } 
  }
}
