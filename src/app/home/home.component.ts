import { Component, OnInit } from '@angular/core';
import { NgwWowService } from 'ngx-wow';
import { ActionsService } from '../services/actions.service';
import { Subscription } from 'rxjs';
import { SplashScreen } from '../models/products.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private splashSub : Subscription = new Subscription;
  addsSplash: any;
  categoriesSplash: any;
  productsSplash: any;
  meta: any;
  links: any;
  constructor(private wowService: NgwWowService,
    private actionService: ActionsService) { 
      this.wowService.init(); 
  }
  ngOnInit(): void {
    this.getSplashScreen()
  }
  getSplashScreen(){
    this.splashSub = this.actionService.getSplashScreen().subscribe({
      next: (resData: SplashScreen)=>{
        this.addsSplash = resData.data.ads;
        this.categoriesSplash = resData.data.categories;
        this.productsSplash = resData.data.products.data;
        this.links = resData.data.products.links;
        this.meta = resData.data.products.meta;       
      },
      error: ()=>{
      }
    })
  }
  ngOnDestroy(): void {
    if(this.splashSub){
      this.splashSub.unsubscribe();
    }
  }
}
