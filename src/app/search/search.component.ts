import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router , NavigationExtras} from '@angular/router';
import { Observable } from 'rxjs';
import { Products} from '../models/products.model';
import { ActionsService } from '../services/actions.service';
import { map, startWith} from 'rxjs/operators';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
 public data: Array<Products> = [];
  constructor(private route: Router,
    private actionService: ActionsService) { }

    myControl = new FormControl('');
    options: string[] = [];
    resultName:any = [];
    filteredOptions!: Observable<string[]>;
  
    ngOnInit() {
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || '')),
      );
      // this.search('');
    }
  
    private _filter(value: string): string[] {
      const filterValue = value.toLowerCase();
  
      return this.options.filter(option => option.toLowerCase().includes(filterValue));
    }
  search(name: any){
    const key = name.target.value;
    this.actionService.search(key).subscribe({
      next: (res)=>{
        this.data = res.data
        console.log(this.data);
        
        res.data.forEach(e=>{
          this.resultName.push(e.name)
        })
        this.options = this.resultName
      }
    })
  }
  goLittleRockStar(){
    this.route.navigate(['/new-add'])
  }
  getSearchRes(){
    
    const navigationExtras: NavigationExtras ={
      queryParams:{
        res: JSON.stringify(this.data)
      }
    }
    // console.log(navigationExtras)
    this.route.navigate(['/search-result', navigationExtras])

  }
}
