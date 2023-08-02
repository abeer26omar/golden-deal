import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ResponseSuccess } from 'src/app/models/actions.model';
import { APIResponse, Products, Search } from 'src/app/models/products.model';
import { ActionsService } from 'src/app/services/actions.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { MacPrefixService } from 'src/app/services/mac-prefix.service';
import { ProductsRequestService } from 'src/app/services/products-request.service';
import { environment as env } from 'src/environments/environment';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['../search.component.css','./search-result.component.css']
})
export class SearchResultComponent implements OnInit, OnDestroy {
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
  is_animating: boolean = false;
  mac: boolean = false;
  constructor(private route: ActivatedRoute,
    private productService: ProductsRequestService,
    private router: Router,
    public actionService: ActionsService,
    private http: HttpClient,
    private errorHandel: ErrorHandlerService,
    private macService: MacPrefixService) { 
    } 
    
    ngOnInit(): void {
      this.routeSub = this.route.params.subscribe((param) => {
        this.key = param['key'];
      });    
      this.getSearchResult(this.key);
      this.owner_id = localStorage.getItem('userId');
      if(this.macService.operatingSysDetect()){
        this.mac = true;
      }else{
        this.mac = false;
      }
  }
  addToFav(product: any){
    this.is_animating = true;
    if(product.product_fav == false){
      this.http.get<ResponseSuccess>(`${env.api_url}/favourites/add-favourite/${product.id}`,this.actionService.httpOptions)
      .subscribe({
        next: res=>{
          // this.actionService.handelRes(res)
          product.product_fav = true  
        },
        error: (err: HttpErrorResponse)=>{
          this.errorHandel.openErrorModa(err)
        }
      })
    }else{
      this.http.get<ResponseSuccess>(`${env.api_url}/favourites/remove-favourite/${product.id}`,this.actionService.httpOptions)
      .subscribe({
        next: res=>{
          // this.actionService.handelRes(res)
          product.product_fav = false  
        },
        error: (err: HttpErrorResponse)=>{
          this.errorHandel.openErrorModa(err)
        }
      })
    }
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
        if(this.searchRes.length == 0){
          this.errMsg = 'لا يوجد منتجات';
        }else{
          this.errMsg = '';
        }  
      },
      error: (err: HttpErrorResponse)=>{
        this.loader = false;        
        // this.errorHandel.openErrorModa(err)
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
  paginate(event: any){
    this.getSearchResult(this.key2,event)
  } 
  ngOnDestroy() :void{
    if(this.routeSub){
      this.routeSub.unsubscribe();
    }
  }
}
