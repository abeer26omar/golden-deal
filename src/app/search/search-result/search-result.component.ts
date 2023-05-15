import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { APIResponse, Products, Search } from 'src/app/models/products.model';
import { ActionsService } from 'src/app/services/actions.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { ProductsRequestService } from 'src/app/services/products-request.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['../search.component.css','./search-result.component.css']
})
export class SearchResultComponent implements OnInit {
  key: any;
  errMsg: string = '';
  error : boolean = false;
  key2: any;
  loader: boolean = false;
  private routeSub: Subscription = new Subscription;
  public searchRes : Array<Products> = [];
  owner_id: any;
  links: any = {};
  meta: any = {};
  constructor(private route: ActivatedRoute,
    private productService: ProductsRequestService,
    private router: Router,
    public actionService: ActionsService,
    private errorHandel: ErrorHandlerService) { 
    } 
    
    ngOnInit(): void {
      this.routeSub = this.route.params.subscribe((param) => {
        this.key = param['key'];
      });    
      this.getSearchResult(this.key);
      this.owner_id = localStorage.getItem('userId');
  }
  getSearchResult(key: string, pageNo?: number){
    this.loader = true;
    this.searchRes = [];
     this.routeSub = this.productService.searchResult(key, pageNo).subscribe({
      next: (res: APIResponse<Products>)=>{
        this.loader = false;
        this.searchRes = res.data;
        this.links = res.links;
        this.meta = res.meta;  
      },
      error: (err: HttpErrorResponse)=>{
        this.loader = false;
        this.errorHandel.openErrorModa(err)
      }
     })
  }
  sellerProfile(id:number){
    if(id == this.owner_id){
      this.router.navigate(['/adds',id])
    }else{
      this.router.navigate(['seller-profile',id])
    }
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
  goLittleRockStar(){
    this.router.navigate(['/new-add'])
  }
  getNewPage(current_page: number,pageNo: any){        
      if(Number.isNaN(+pageNo)){
        if(pageNo.includes('Previous')){
          pageNo = current_page - 1;
          this.getSearchResult(this.key,+pageNo);
        }else{
          pageNo = current_page + 1;
          this.getSearchResult(this.key,+pageNo); 
        }
      }else{
        this.getSearchResult(this.key,+pageNo)
      }
  } 
  ngOnDestory() :void{
    if(this.routeSub){
      this.routeSub.unsubscribe();
    }
  }
}
