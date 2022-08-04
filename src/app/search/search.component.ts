import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Products} from '../models/products.model';
import { ActionsService } from '../services/actions.service';
import { map, startWith} from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
 public data: Array<Products> = [];
 key: string = '';
  constructor(private route: Router,
    private actionService: ActionsService) { }
    
  
  ngOnInit() {
  }
  search(name: any){
    this.key = name.target.value;
  }
  goLittleRockStar(){
    this.route.navigate(['/new-add'])
  }
  getSearchResult(){
    this.route.navigate([`/search-result`,{ key: this.key }])
  }
}
