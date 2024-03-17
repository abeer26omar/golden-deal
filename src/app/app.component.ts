import { AfterViewInit, Component, ElementRef, OnInit, Output, Renderer2 } from '@angular/core';
import { AuthService } from './services/auth.service';
import { NotificationsService } from './services/notifications.service';
import { APIResponse2, Category } from './models/products.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductsRequestService } from './services/products-request.service';
import { ErrorHandlerService } from './services/error-handler.service';
import { GoBackService } from './services/go-back.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit{
  title = 'Golden-deal';
  sidebarOpen = true;
  notification: any;
  private_marking: boolean = false;
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
    private router: Router){
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
      this.goBackService.goBack();
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          if (this.router.url.includes('private-marketing')) {
            this.private_marking = true;
          } else {
            this.private_marking = false;
          }
        }
      });
  }
  ngAfterViewInit(): void {
    this.backdrops = Array.from(this.elementRef.nativeElement.querySelectorAll('.modal-backdrop'));
  }
}