import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { APIresponse2, Favourites, Orders, Portfolio } from '../models/actions.model';
import { ActionsService } from '../services/actions.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogSolidComponent } from './dialog-solid/dialog-solid.component';
import { DialogDeleteComponent } from './dialog-delete/dialog-delete.component';

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
  portfolioId!: number;
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
  productsStatus: any;
  public orders: Array<Orders> = [];
  private portSub : Subscription = new Subscription;
  private routeSub : Subscription = new Subscription;
  private favSub: Subscription = new Subscription;
  private orderSub: Subscription = new Subscription;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private actionService: ActionsService,
    private dialogRef: MatDialog) { 
      this.actionService.refresh.subscribe((res)=>{
        this.getMyFav();
        this.getMyOrders();
      })
    }

  ngOnInit(): void {
    this.filterModal = new window.bootstrap.Modal(
      document.getElementById('myModalFilter')
    );
    this.routeSub = this.route.params.subscribe((params: Params) => {
      this.portfolioId = params['id'];
      this.getPortfolioInfo(this.portfolioId);
    });
  }
  getPortfolioInfo(id: number){
    this.portSub = this.actionService.getPortfolio(id).subscribe({
      next: (resData: Portfolio)=>{
        this.portfolio = resData;
      }
    })
  }
  
  getInfoStatus(status: any){
    this.portSub = this.actionService.getPortfolio(this.portfolioId).subscribe({
      next: (resData: Portfolio)=>{
        resData.data.products.forEach(ele=>{
          if(ele.status == status){
            this.productsStatus.push(ele);
          }
          console.log('fghjk')
        })
      }
    })
  }
  getMyFav(){
    this.favSub = this.actionService.getMyFav().subscribe({
      next: (resData: Favourites)=>{
        this.favoraties = resData;
        // console.log(this.favoraties.data);
      },
      error: err=>{
        console.log(err)
      }
    })
  }
  removeFav(id: number){
    this.actionService.removeFav(id);
  }
  getMyOrders(){
    this.orderSub = this.actionService.getMyOrders().subscribe({
      next:(resData: APIresponse2<Orders>)=>{
        this.orders = resData.data;
        // console.log(resData)
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
  addNewAdd(){
    this.router.navigate(['new-add'])
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
   }
}
