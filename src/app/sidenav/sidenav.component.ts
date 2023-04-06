import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ResponseSuccess } from '../models/actions.model';
import { Category,APIResponse2 } from '../models/products.model';
import { AuthService } from '../services/auth.service';
import { ProductsRequestService } from '../services/products-request.service'
declare var window: any;

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  @Output() closeSideNav:EventEmitter<any> = new EventEmitter();

  panelOpenState = false;
  httpService: any;
  public categories : Array<Category> = [];
  userId!: any;
  error: string = '';
  msgSucess: string = '';
  toastSuccess: any;
  toastFaild: any;
  
  constructor(public authService: AuthService,
    private route: Router,
    private categoryService: ProductsRequestService) { 
    this.userId = localStorage.getItem('userId');
    }
  ngOnInit(): void {
    this.getCategories();
    this.toastSuccess = new window.bootstrap.Toast(
      document.getElementById('toastSuccess')
    )
    this.toastFaild = new window.bootstrap.Toast(
      document.getElementById('toastFaild')
    )
  }
  closeNav(){
    this.closeSideNav.emit();
  }
  private categorySub : Subscription = new Subscription;

  getCategories(){
    this.categorySub = this.categoryService.
    getProductsCategories().
    subscribe({
      next:(categoryList: APIResponse2<Category>)=>{ 
        this.categories = categoryList.data;
      }
    })
  }
  logOut(){
    this.authService.logOut().subscribe({
      next:(res: ResponseSuccess)=>{
        this.toastSuccess.show();
        this.msgSucess = res.data
        localStorage.clear();
        this.route.navigate(['/home'])
        setTimeout(()=>{
          window.location.reload();
        },50)
      },
      error: ()=>{
        this.toastFaild.show();
        localStorage.clear();
        setTimeout(()=>{
          window.location.reload();
        },50)
      }
    })
  }
  termsCondition(slug: string){
    this.route.navigate(['/termsandconditions',slug])
  }
  ngOnDestory() :void{
   if(this.categorySub){
     this.categorySub.unsubscribe();
   }
  }

}
