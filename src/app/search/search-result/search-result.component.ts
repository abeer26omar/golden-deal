import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { APIResponse5, Search } from 'src/app/models/products.model';
import { ProductsRequestService } from 'src/app/services/products-request.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit {
  key: any;
  errMsg: string = '';
  error : boolean = false;
  key2: any;
  loader: boolean = false;
  private routeSub: Subscription = new Subscription;
  public searchRes : Array<Search> = [];

  constructor(private route: ActivatedRoute,
    private productService: ProductsRequestService,
    private router: Router) { 
    } 
    
    ngOnInit(): void {
      this.routeSub = this.route.params.subscribe((param) => {
        this.key = param['key'];
      });    
      this.getSearchResult(this.key);
  }
  getSearchResult(key: string){
    this.loader = true;
    this.searchRes = [];
     this.routeSub = this.productService.searchResult(key).subscribe({
      next: (res: APIResponse5<Search>)=>{
        this.loader = false;
        this.searchRes = res.data;
      },
      error: (err: HttpErrorResponse)=>{
        this.loader = false;
        this.error = true;
        this.errMsg = err.error.data;                
      }
     })
  }
  search(name:any){
    this.key2 = name.target.value;    
    this.error = false;
    this.errMsg = '';
    this.getSearchResult(this.key2);
  }
  productDetails(id: number){
    this.router.navigate(['product-details', id])
  }
  ngOnDestory() :void{
    if(this.routeSub){
      this.routeSub.unsubscribe();
    }
  }
}
