import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Portfolio, Products, ResponseSuccess } from '../models/actions.model';
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
export class SellerProfileComponent implements OnInit {
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
      products: []
    }
  }
  is_animating: boolean = false;
  active_status: string = 'نشطه';
  productsStatus: Array<Products> = [];
  private portSub : Subscription = new Subscription;
  private routeSub : Subscription = new Subscription;
  
  constructor(private router: Router,
    private route: ActivatedRoute,
    private actionService: ActionsService,
    private macService: MacPrefixService,
    private errorHandel: ErrorHandlerService,
    private http: HttpClient) { 
      this.actionService.refresh.subscribe(()=>{
        this.getPortfolioInfo(this.portfolioId);
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
    });
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
  onSelected(status: any){
    this.load = true;
    this.portSub = this.actionService.getPortfolio(this.portfolioId).subscribe({
      next: (resData: Portfolio)=>{
        this.load = false;
        resData.data.products.forEach(ele=>{          
          if(ele.active == status.target.value){
            this.portfolio.data.products = resData.data.products;
          }else{
            this.result = 'لا يوجد عناصر';
            this.portfolio.data.products = [];
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
  ngOnDestory() :void{
    if(this.portSub){
      this.portSub.unsubscribe();
    } 
    if(this.routeSub){
      this.routeSub.unsubscribe();
    }
  }
}
