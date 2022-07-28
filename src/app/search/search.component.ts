import { JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router , NavigationExtras} from '@angular/router';
import { Products} from '../models/products.model';
import { ActionsService } from '../services/actions.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
 public data: Array<Products> = [];
  constructor(private route: Router,
    private actionService: ActionsService) { }

  ngOnInit(): void {
  }
  search(name: any){
    const key = name.target.value;
    //  this.actionService.search(key).subscribe({
    //   next: (res: APIResponse2<Products>)=>{
    //     this.data = res.data
    //     // console.log(res)
    //   },
    //   error: err=>{
    //     console.log(err)
    //   }
    //  })
    const search = this.actionService.search(key.trim()).then(
      (response) =>{
        this.data = response.data
        // console.log(response)
        console.log(this.data)
      },
      error=>{
        console.log(error)
      }
    )
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
