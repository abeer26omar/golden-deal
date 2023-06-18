import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Notifications, ResponseSuccess } from '../models/actions.model';
import { Category,APIResponse2 } from '../models/products.model';
import { AuthService } from '../services/auth.service';
import { ProductsRequestService } from '../services/products-request.service'
import { MacPrefixService } from '../services/mac-prefix.service';
import { GetproductsService } from '../services/getproducts.service';
import { ErrorHandlerService } from '../services/error-handler.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationsService } from '../services/notifications.service';
import { ChatService } from '../services/chat.service';
import { MessagesList } from '../models/chat.model';
declare var window: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() load: boolean = false;
  @Output() toggleSideBar: EventEmitter<any> = new EventEmitter();
  @Output() notifications: Notifications = {
    data: [],
    links: {
        first: '',
        last: '',
        prev: '',
        next: ''
    },
    meta: {
        current_page: 0,
        from: 0,
        last_page: 0,
        links: [
            {
                url: '',
                label: '',
                active: false
            }
        ],
        path: '',
        per_page: 0,
        to: 0,
        total: 0
    }
  }
  @Output() errorNot: string = '';
  panelOpenState = false;
  httpService: any;
  public categories : Array<Category> = [];
  userId!: any;
  userImage: any;
  error: string = '';
  msgSucess: string = '';
  toastSuccess: any;
  toastFaild: any;
  payDepositModal: any;
  deposit: any;
  count_msgs: number = 0;
  constructor(public authService: AuthService,
    private route: Router,
    private categoryService: ProductsRequestService,
    private macService: MacPrefixService,
    public getProducts: GetproductsService,
    private errorHandel: ErrorHandlerService,
    private notificationService: NotificationsService,
    private chatService: ChatService) { 
      this.userId = localStorage.getItem('userId');
      this.userImage = localStorage.getItem('userImage')
      this.authService.refresh.subscribe(()=>{
      this.userImage = localStorage.getItem('userImage')
      // this.chatService.refresh.subscribe(()=>{
      //   this.getAllPreMsgList();
      // })
    })
  }
  private notifiSub : Subscription = new Subscription;

  ngOnInit(): void { 
    this.getCategories();
    this.toastSuccess = new window.bootstrap.Toast(
      document.getElementById('toastSuccess'),{backdrop: this.macService.backdrop}
    )
    this.toastFaild = new window.bootstrap.Toast(
      document.getElementById('toastFaild'),{backdrop: this.macService.backdrop}
    )
    if(this.authService.IsloggedIn()){      
      this.notificationService.getMyNotifications(this.pageNo);
    }
    // this.getAllPreMsgList()
  }
  private categorySub : Subscription = new Subscription;
  stopPropagation(event: any){
    event.stopPropagation();
  }
  pageNo: number = 1;
  lastpage: number = 1;
  getMyNotifications(pageNo:number){
    this.load = true;
    this.notifiSub = this.notificationService.getMyNotifications(this.pageNo).subscribe({
      next: (resData: Notifications)=>{
        this.load = false;
        if(resData.data.length == 0){
          this.errorNot = 'لا يوجد اشعارات';
        }else{
          this.errorNot = '';
        }
        this.lastpage = resData.meta.last_page;
        resData.meta.current_page = this.pageNo;
        this.notifications.data = this.notifications.data.concat(resData.data)                
      },
      error: (err: HttpErrorResponse)=>{
        this.load = false;
        this.errorHandel.openErrorModa(err)
      }
    })
  }
  getCategories(){
    this.categorySub = this.categoryService.
    getProductsCategories().
    subscribe({
      next:(categoryList: APIResponse2<Category>)=>{ 
        this.categories = categoryList.data;
      },
      error: (err: HttpErrorResponse)=>{
        this.errorHandel.openErrorModa(err)
      }
    })
  }
  logOut(){
    this.authService.logOut().subscribe({
      next:(res: ResponseSuccess)=>{
        this.toastSuccess.show();
        this.msgSucess = res.data
        localStorage.clear();
        this.route.navigate(['/'])
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
  loadMore(){
    const list = document.querySelector('#notification_list') as HTMLElement;    
    const scrollPosition = list.scrollTop + list.clientHeight;
    const maxScroll = list.scrollHeight;
    if (scrollPosition === maxScroll) {
      if(this.lastpage !== this.pageNo){
        this.pageNo +=1;
        setTimeout(()=>{
          this.getMyNotifications(this.pageNo);      
        },500)
      }
    }    
  }
  getAllPreMsgList(){
    this.chatService.getAllPreMsgList(this.userId).subscribe({
      next: (res: Array<MessagesList>)=>{
        res.forEach(e=>{
          if(e.receiver == this.userId && e.seen_at == 0){
            this.count_msgs += this.count_msgs;
          }
        })
      }
    })
  }
  ngOnDestory() :void{
   if(this.categorySub){
     this.categorySub.unsubscribe();
   }
   if(this.notifiSub){
    this.notifiSub.unsubscribe();
  }
  }
}
