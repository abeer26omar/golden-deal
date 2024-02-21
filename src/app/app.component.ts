import { AfterViewInit, Component, ElementRef, OnInit, Output, Renderer2 } from '@angular/core';
import { AuthService } from './services/auth.service';
import { NotificationsService } from './services/notifications.service';
import { APIResponse2, Category } from './models/products.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductsRequestService } from './services/products-request.service';
import { ErrorHandlerService } from './services/error-handler.service';
import { GoBackService } from './services/go-back.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClearStorageService } from './services/clear-storage.service';
declare var window: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit{
  title = 'Golden-deal';
  sidebarOpen = true;
  notification: any;
  @Output() categories : Array<Category> = [];
  // backdrops = Array.from(document.getElementsByClassName('modal-backdrop') as HTMLCollectionOf<HTMLElement>)
  backdrops!: HTMLElement[];

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
    private goBackService: GoBackService,
    private snackBar: MatSnackBar,
    private elementRef: ElementRef,
    private clearStorage: ClearStorageService){
      this.backdrops = [];
      this.hidebackdrop();
  }
    hidebackdrop(){
      this.backdrops.forEach(element => {
        element.style.opacity = '1';
      });
    }
  ngOnInit(): void {
    // this.clearSorageForReAuth();
      this.getCategories()
      if(this.authService.IsloggedIn()){
        this.notificationService.insideChatComponent.subscribe((insideChat)=>{
          if(!insideChat){
            this.notificationService.requestPermission();
            this.notificationService.getMyNotifications();
            this.notificationService.getNotification();
            this.notificationService.currentMessage.subscribe(
              (payload) => {
                if (payload) {
                  this.snackBar.open(payload.notification.body, payload.notification.title, {
                    duration: 5000,
                    horizontalPosition: 'center',
                    verticalPosition: 'top'
                  });
                }                
              })
          }
        })
      }
      this.goBackService.goBack()
  }
  ngAfterViewInit(): void {
    this.backdrops = Array.from(this.elementRef.nativeElement.querySelectorAll('.modal-backdrop'));
  }
  // clearSorageForReAuth(){
  //   this.clearStorage.removeTokenAfterOneHour();

  //   // Handle app closing event
  //   window.onbeforeunload = () => {
  //     this.clearStorage.storeTimestampOnClose();      
  //   };

  //   // Check elapsed time when the app is reopened
  //   const elapsed = this.clearStorage.calculateElapsedTime();
  //   const oneHourInMillis = 24 * 60 * 60 * 1000; // 1 hour in milliseconds

  //   if (elapsed >= oneHourInMillis) {
  //     // Remove the token from localStorage if more than an hour elapsed
  //     localStorage.removeItem('token_deal');
  //     localStorage.removeItem('userId');
  //     localStorage.removeItem('region_id');
  //     localStorage.removeItem('userImage');
  //     localStorage.removeItem('loginTime');
  //     localStorage.removeItem('closeTime');
  //   } else {
  //     // Calculate remaining time and schedule token removal
  //     const remainingTime = oneHourInMillis - elapsed;
  //     setTimeout(() => {
  //       // Remove the token from localStorage after the remaining time
  //       localStorage.removeItem('token_deal');
  //       localStorage.removeItem('userId');
  //       localStorage.removeItem('region_id');
  //       localStorage.removeItem('userImage');
  //       localStorage.removeItem('loginTime');
  //       localStorage.removeItem('closeTime');
  //     }, remainingTime);
  //   }
  // }
}
