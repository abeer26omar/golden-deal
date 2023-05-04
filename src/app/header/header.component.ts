import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
  payDepositModal: any;
  deposit: any;
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
    // this.payDepositModal = new window.bootstrap.Modal(
    //   document.getElementById('payDepositModal'),{backdrop: this.macService.backdrop}
    // )
  }
  private categorySub : Subscription = new Subscription;
  stopPropagation(event: any){
    event.stopPropagation();
  }
  // payDeposit(){
  //   this.payDepositModal.show()
  // }
  // calcDeposit(event: any){
  //   if(event.target.value !== ''){
  //     this.deposit = (1/100 * event.target.value)
  //   }else{
  //     this.deposit = '';
  //   }
  // }
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
  toggleSidebar(){
    this.toggleSideBar.emit();
  }
  ngOnDestory() :void{
   if(this.categorySub){
     this.categorySub.unsubscribe();
   }
  }
}
