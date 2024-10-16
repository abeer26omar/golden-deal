import { Component, EventEmitter, OnInit, Output, OnDestroy, Input } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ResponseSuccess } from '../models/actions.model';
import { Category,APIResponse2 } from '../models/products.model';
import { AuthService } from '../services/auth.service';
import { ProductsRequestService } from '../services/products-request.service'
import { ErrorHandlerService } from '../services/error-handler.service';
import { CookieService } from 'ngx-cookie-service';

declare var window: any;

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit, OnDestroy {
  @Output() closeSideNav:EventEmitter<any> = new EventEmitter();
  @Input() categories : Array<Category> = [];

  panelOpenState = false;
  httpService: any;
  // public categories : Array<Category> = [];
  userId!: any;
  error: string = '';
  msgSucess: string = '';
  toastSuccess: any;
  toastFaild: any;
  
  constructor(public authService: AuthService,
    private route: Router,
    private categoryService: ProductsRequestService,
    private errorHandel: ErrorHandlerService, 
    private cookieService: CookieService) { 
    this.userId = localStorage.getItem('userId') || this.cookieService.get('userId');
    }
  ngOnInit(): void {
    // this.getCategories();
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
  // private categorySub : Subscription = new Subscription;

  // getCategories(){
  //   this.categorySub = this.categoryService.
  //   getProductsCategories().
  //   subscribe({
  //     next:(categoryList: APIResponse2<Category>)=>{ 
  //       this.categories = categoryList.data;
  //     },
  //     error: (err: HttpErrorResponse)=>{
  //       this.errorHandel.openErrorModa(err);
  //     }
  //   })
  // }
  gotoAuth(router: string){
    this.route.navigate([`/${router}`]);
  }
  logOut(){
    this.authService.logOut().subscribe({
      next:(res: ResponseSuccess)=>{
        this.toastSuccess.show();
        this.msgSucess = res.data
        localStorage.clear();
        this.cookieService.deleteAll();
        this.route.navigate(['/'])
        setTimeout(()=>{
          window.location.reload();
        },50)
      },
      error: (err: HttpErrorResponse)=>{
        this.toastFaild.show();
        localStorage.clear();
        this.cookieService.deleteAll();
        setTimeout(()=>{
          window.location.reload();
        },50)
        this.errorHandel.openErrorModa(err);
      }
    })
  }
  termsCondition(slug: string){
    this.route.navigate(['/termsandconditions',slug])
  }
  ngOnDestroy() :void{
  //  if(this.categorySub){
  //    this.categorySub.unsubscribe();
  //  }
  }

}
