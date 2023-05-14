import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Notifications } from '../models/actions.model';
import { Subscription } from 'rxjs';
import { NotificationsService } from '../services/notifications.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandlerService } from '../services/error-handler.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  notifications: Notifications = {
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
  private notifiSub : Subscription = new Subscription;

  constructor(private notificationService: NotificationsService,
    private errorHandel: ErrorHandlerService) { }

  ngOnInit(): void {
    this.getMyNotifications();
  }
  getMyNotifications(){
    this.notifiSub = this.notificationService.getMyNotifications().subscribe({
      next: (resData: Notifications)=>{
        this.notifications = resData;                
      },
      error: (err: HttpErrorResponse)=>{
        this.errorHandel.openErrorModa(err)
      }
    })
  }
  // scrolll
  @ViewChild('notification') notification!: ElementRef;

  newScroll: boolean = false;
  @HostListener('window:scroll') onScroll(){
  }
  ngOnDestory() :void{
    if(this.notifiSub){
      this.notifiSub.unsubscribe();
    }
  }
}
