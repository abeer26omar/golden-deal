import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Products} from '../models/products.model';
import { MacPrefixService } from '../services/mac-prefix.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
 public data: Array<Products> = [];
 key: string = '';
 mac: boolean= false;
  constructor(private route: Router,
    private macService: MacPrefixService) { 
    }
    
    ngOnInit() {
      this.mac = this.macService.macsearch
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
}
