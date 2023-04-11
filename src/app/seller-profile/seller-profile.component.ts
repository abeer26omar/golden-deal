import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Portfolio, Products } from '../models/actions.model';
import { ActionsService } from '../services/actions.service';
import { MacPrefixService } from '../services/mac-prefix.service';

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
  active_status: string = 'نشطه';
  productsStatus: Array<Products> = [];
  private portSub : Subscription = new Subscription;
  private routeSub : Subscription = new Subscription;
  
  constructor(private router: Router,
    private route: ActivatedRoute,
    private actionService: ActionsService,
    private macService: MacPrefixService) { 
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
      }
    })
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
      error: ()=>{
        this.load = false;
        this.filterModal.hide();
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
