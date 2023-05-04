import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { APIresponse2, Favourites, Orders, Portfolio, Products } from '../models/actions.model';
import { ActionsService } from '../services/actions.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogSolidComponent } from './dialog-solid/dialog-solid.component';
import { DialogDeleteComponent } from './dialog-delete/dialog-delete.component';
import { DialogCoverComponent } from './dialog-cover/dialog-cover.component';
import { MacPrefixService } from '../services/mac-prefix.service';
import { APIResponse2, Purchases } from '../models/user.model';
import { ProfileService } from '../services/profile.service';

declare var window: any;

@Component({
  selector: 'app-adds',
  templateUrl: './adds.component.html',
  styleUrls: ['./adds.component.css']
})
export class AddsComponent implements OnInit {
  filterModal: any;
  deleteModal: any;
  solidModal: any;
  faildAdds: any;
  successAdds: any;
  portfolioId!: number;
  error: string = '';
  errFav: string = '';
  errorder: string = '';
  errrecord: string = '';
  successMsg: string = '';
  loadding: boolean = false;
  result: string = '';
  load: boolean = false;
  active_status: string = 'نشطه';
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
  favoraties: Favourites ={
    data:{
      id: 0,
      name: '',
      image_url: '',
      cover_url: '',
      favourites: []
    }
  }
  productsStatus: Array<Products> = [];
  public orders: Array<Orders> = [];
  private recordSub: Subscription = new Subscription;
  public records: Array<Purchases> = [];
  private portSub : Subscription = new Subscription;
  private routeSub : Subscription = new Subscription;
  private favSub: Subscription = new Subscription;
  private orderSub: Subscription = new Subscription;
  constructor(private router: Router,
    private route: ActivatedRoute,
    public actionService: ActionsService,
    private dialogRef: MatDialog,
    private macService: MacPrefixService,
    private profileService: ProfileService) { 
      this.actionService.refresh.subscribe(()=>{
        this.getMyFav();
        this.getMyOrders();
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
    this.successAdds = new window.bootstrap.Modal(
      document.getElementById('successAdds'),{backdrop: this.macService.backdrop}
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
      error: ()=>{
        this.loadding = false;
      }
    })
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
  getMyFav(){
    this.favSub = this.actionService.getMyFav().subscribe({
      next: (resData: Favourites)=>{
        this.favoraties = resData;        
        if(this.favoraties.data.favourites.length == 0){
          this.errFav = 'لا يوجد مفضله';
        }else{
          this.errFav = '';
        }
      },
      error: ()=>{
      }
    })
  }
  removeFav(id: number){
    // this.actionService.removeFav(id).subscribe({
    //   next:(res: ResponseSuccess)=>{
    //     this.successMsg = res.data
    //     this.successAdds.show(); 
    //     setTimeout(() => {
    //     this.successAdds.hide(); 
    //     }, 1000);               
    //   },
    //   error: (err: HttpErrorResponse)=>{
    //     console.log(err);
    //     if(err.error.data){
    //       this.error = err.error.data;
    //     }else{
    //       this.error = err.statusText;
    //     }
    //     this.faildAdds.show();
    //   }
    // })
  }
  getMyOrders(){
    this.loadding = true;
    this.orderSub = this.actionService.getMyOrders().subscribe({
      next:(resData: APIresponse2<Orders>)=>{
        this.loadding = false;
        this.orders = resData.data;
        if(this.orders.length == 0){
          this.errorder = 'لا يوجد طلبات';
        }else{
          this.errorder = '';
        }
      },
      error: ()=>{
        this.loadding = false;
      }
    })
  }
  getMyRecord(){
    this.recordSub = this.profileService.buyingRecord().subscribe({
      next: (resData: APIResponse2<Purchases>)=>{
        this.loadding = false;
        this.records = resData.data;        
        if(this.records.length == 0){
          this.errrecord = 'لا يوجد مشتريات'
        }else{
          this.errrecord = '';
        }
      },
      error: ()=>{
        this.loadding = false;
      }
    })
  }
  productDetails(id:number){
    this.router.navigate(['product-details', id])
  }
  openFilterModal(){
    this.filterModal.show();
  }
  openSolidDialog(id: number){
    this.dialogRef.open(DialogSolidComponent,{
      data: {
        id: id
      }
    })
  }
  openDelDialog(id: number){
    this.dialogRef.open(DialogDeleteComponent,{
      data: {
        id: id
      }
    })
  }
  editCover(imgSrc: string){
    this.dialogRef.open(DialogCoverComponent,{
      data: {
        imgSrc: imgSrc
      }
    })
  }
  addNewAdd(){
    this.router.navigate(['new-add'])
  }
  editAdd(id: number){
    this.router.navigate([`edit-add/${id}`])
  }
  ngOnDestory() :void{
    if(this.portSub){
      this.portSub.unsubscribe();
    } 
    if(this.routeSub){
      this.routeSub.unsubscribe();
    }
    if(this.favSub){
      this.favSub.unsubscribe();
    }
    if(this.orderSub){
      this.orderSub.unsubscribe();
    }
    if(this.recordSub){
      this.recordSub.unsubscribe()
    }
  }
}
