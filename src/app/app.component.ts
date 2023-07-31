import { Component, HostListener, OnInit, Output } from '@angular/core';
import { AuthService } from './services/auth.service';
import { NotificationsService } from './services/notifications.service';
import { APIResponse2, Category } from './models/products.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductsRequestService } from './services/products-request.service';
import { ErrorHandlerService } from './services/error-handler.service';
import { GoBackService } from './services/go-back.service';
declare var window: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Golden-deal';
  sidebarOpen = true;
  notification: any;
  @Output() not_count: number = 0;
  @Output() categories : Array<Category> = [];
  backdrops = Array.from(document.getElementsByClassName('modal-backdrop') as HTMLCollectionOf<HTMLElement>) 
  toggle(){
    this.sidebarOpen = !this.sidebarOpen;
  }
  close(){
    this.sidebarOpen = !this.sidebarOpen;
  }
  getCategories(){
    this.categoryService.
      getProductsCategories().
      subscribe({
        next:(categoryList: APIResponse2<Category>)=>{ 
          this.categories = categoryList.data;
        },
        error: (err: HttpErrorResponse)=>{
          this.errorHandel.openErrorModa(err);
        }
      })
  }
  constructor(public authService: AuthService,
    private notificationService: NotificationsService,
    private categoryService: ProductsRequestService,
    private errorHandel: ErrorHandlerService,
    private goBackService: GoBackService){
      this.hidebackdrop();
    }
    hidebackdrop(){
      this.backdrops.forEach(element => {
        element.style.opacity = '1';
      });
    }
    ngOnInit(): void {
      this.getCategories()
      this.not_count = 0;
      if(this.authService.IsloggedIn()){
        this.not_count += this.not_count;
        this.notificationService.insideChatComponent.subscribe((insideChat)=>{
          if(!insideChat){
            // this.notificationService.requestPermission();
            this.not_count += this.not_count;
            this.notificationService.getMyNotifications();
          }
        })
      }
      this.goBackService.goBack()
  }
}
