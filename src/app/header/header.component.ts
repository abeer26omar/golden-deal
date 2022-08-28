import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ResponseSuccess } from '../models/actions.model';
import { Category,APIResponse2 } from '../models/products.model';
import { AuthService } from '../services/auth.service';
import { ProductsRequestService } from '../services/products-request.service'
import { MacPrefixService } from '../services/mac-prefix.service';
declare var window: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() toggleSideBar: EventEmitter<any> = new EventEmitter();
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
    private categoryService: ProductsRequestService,
    private macService: MacPrefixService) { 
    this.userId = localStorage.getItem('userId')
  }
  ngOnInit(): void { 
    this.getCategories();
    this.toastSuccess = new window.bootstrap.Toast(
      document.getElementById('toastSuccess'),{backdrop: this.macService.backdrop}
    )
    this.toastFaild = new window.bootstrap.Toast(
      document.getElementById('toastFaild'),{backdrop: this.macService.backdrop}
    )
  }
  private categorySub : Subscription = new Subscription;
  stopPropagation(event: any){
    event.stopPropagation();
  }
  getCategories(){
    this.categorySub = this.categoryService.
    getProductsCategories().
    subscribe({
      next:(categoryList: APIResponse2<Category>)=>{ 
        this.categories = categoryList.data;
      },
      error: (err: HttpErrorResponse)=>{
        this.toastFaild.show();
        if(err.error.data){
          this.error = err.error.data;
        }else{
          this.error = err.statusText;
        }
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
        },500)
      },
      error: (err: HttpErrorResponse)=>{
        this.toastFaild.show();
        localStorage.clear();
        window.location.reload();
        if(err.error.data){
          this.error = err.error.data;
        }else{
          this.error = err.statusText;
        }
      }
    })
  }
  termsCondition(slug: string){
    this.route.navigate(['/termsandconditions',slug])
  }
  toggleSidebar(){
    this.toggleSideBar.emit();
  }
  ngOnDestory() :void{
   if(this.categorySub){
     this.categorySub.unsubscribe();
   }
  }
}
