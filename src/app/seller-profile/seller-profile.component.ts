import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Portfolio, Products, ResponseSuccess, UserProducts } from '../models/actions.model';
import { ActionsService } from '../services/actions.service';
import { MacPrefixService } from '../services/mac-prefix.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ErrorHandlerService } from '../services/error-handler.service';
import { environment as env } from 'src/environments/environment';

declare var window: any;

@Component({
  selector: 'app-seller-profile',
  templateUrl: './seller-profile.component.html',
  styleUrls: ['./seller-profile.component.css']
})
export class SellerProfileComponent implements OnInit, OnDestroy {
  filterModal: any;  
  faildAdds: any;
  portfolioId!: number;
  error: string = '';
  loadding: boolean = false;
  result: string = '';
  load: boolean = false;
  portfolio: Portfolio = {
    data:{
      id: 0,
      name: '',
      subscribed: 0,
      image: '',
      cover: '',
      sum_of_ratings: 0,
      ratings_count: 0,
      reviews: [],
      provider_ratings: [],
      image_url: '',
      cover_url: '',
    }
  }
  public products: Array<Products> = [];
  links: any = {};
  meta: any = {};  
  is_animating: boolean = false;
  active_status: string = 'نشطه';
  errProducts: string = '';
  productsStatus: Array<Products> = [];
  private portSub : Subscription = new Subscription;
  private routeSub : Subscription = new Subscription;
  mac: boolean = false;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private actionService: ActionsService,
    private macService: MacPrefixService,
    private errorHandel: ErrorHandlerService,
    private http: HttpClient) { 
      this.actionService.refresh.subscribe(()=>{
        this.getUserProducts(this.portfolioId)        
      })
    }

  ngOnInit(): void {
    this.filterModal = new window.bootstrap.Modal(
      document.getElementById('myModalFilter'),{backdrop: this.macService.backdrop}
    );
    this.faildAdds = new window.bootstrap.Modal(
      document.getElementById('faildAdds'),{backdrop: this.macService.backdrop}
    )
    this.routeSub = this.route.params.subscribe((params: Params) => {
      this.portfolioId = params['id'];
      this.getPortfolioInfo(this.portfolioId);
      this.getUserProducts(this.portfolioId)
    });
    if(this.macService.operatingSysDetect()){
      this.mac = true;
    }else{
      this.mac = false;
    }
  }
  getPortfolioInfo(id: number){
    this.loadding = true;
    this.portSub = this.actionService.getPortfolio(id).subscribe({
      next: (resData: Portfolio)=>{
        this.loadding = false;
        this.portfolio = resData;
      },
      error: (err: HttpErrorResponse)=>{
        this.loadding = false;
        this.errorHandel.openErrorModa(err)
      }
    })
  }
  getUserProducts(id: number, pageNo: number=1){
    this.portSub = this.actionService.getPortfolioProducts(id,pageNo).subscribe({
      next: (productsList: UserProducts)=>{
        this.loadding = false;
        this.products = productsList.data;
        this.links = productsList.links;        
        this.meta = productsList.meta;
        if(this.products.length == 0){
          this.errProducts = 'لا يوجد اعلانات';
          this.products = [];
        }else{
          this.errProducts = '';
        }
      },
      error: (err: HttpErrorResponse)=>{
        this.loadding = false;
        this.errorHandel.openErrorModa(err)
      }
    })
  }
  addToFav(product: any){
    this.is_animating = true;
    if(product.product_fav == false){
      this.http.get<ResponseSuccess>(`${env.api_url}/favourites/add-favourite/${product.id}`,this.actionService.httpOptions)
      .subscribe({
        next: res=>{
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
  openFilterModal(){
    this.filterModal.show();
  }
  productDetails(id:number){
    this.router.navigate(['product-details', id])
  }
  onSelected(status: any,pageNo: number = 1){
    this.load = true;
    this.portSub = this.actionService.getPortfolioProducts(this.portfolioId,pageNo).subscribe({
      next: (resData: UserProducts)=>{
        this.load = false;
        resData.data.forEach(ele=>{          
          if(ele.status == status.target.value){
            this.products = resData.data;
            this.links = resData.links;        
            this.meta = resData.meta;
          }else{
            if(this.products.length == 0){
              this.errProducts = 'لا يوجد اعلانات';
            }else{
              this.errProducts = '';
            }
            this.products = [];
          }
          this.active_status = status.target.selectedOptions[0].innerText
          this.filterModal.hide();
        })
      },
      error: (err: HttpErrorResponse)=>{
        this.load = false;
        this.filterModal.hide();
        this.errorHandel.openErrorModa(err)
      }
    })
  }
  paginate(event: any,meta_path: string){
    this.getUserProducts(this.portfolioId,event.page+1)
  } 
  ngOnDestroy() :void{
    if(this.portSub){
      this.portSub.unsubscribe();
    } 
    if(this.routeSub){
      this.routeSub.unsubscribe();
    }
  }
}
