import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Category,APIResponse2 } from '../models/products.model';
import { AuthService } from '../services/auth.service';
import { ProductsRequestService } from '../services/products-request.service'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  panelOpenState = false;
  httpService: any;
  public categories : Array<Category> = [];
  userId!: any;
  constructor(public authService: AuthService,
    private route: Router,
    private categoryService: ProductsRequestService ) { 
  }
  ngOnInit(): void { 
    this.getCategories();
    this.userId = localStorage.getItem('userId')
    // console.log()
  }
  private categorySub : Subscription = new Subscription;

  getCategories(){
    this.categorySub = this.categoryService.
    getProductsCategories().
    subscribe((categoryList: APIResponse2<Category>)=>{ 
      this.categories = categoryList.data;
      // console.log(categoryList.data);
    })
  }
  logOut(){
    this.authService.logOut().subscribe({
      next:(res)=>{
        console.log(res)
        localStorage.clear();
        window.location.reload()
      },
      error: (err)=>{
        console.log(err)
      }
    })
  }
  termsCondition(slug: string){
    this.route.navigate(['/termsandconditions',slug])
  }
  prop(event: any){
    event.stopPropagation();  
  }
  ngOnDestory() :void{
   if(this.categorySub){
     this.categorySub.unsubscribe();
   }
   
  }
}
