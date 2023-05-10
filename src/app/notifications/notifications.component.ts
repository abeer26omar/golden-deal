import { Component, OnInit } from '@angular/core';
import { Notifications } from '../models/actions.model';
import { Subscription } from 'rxjs';
import { NotificationsService } from '../services/notifications.service';

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

  constructor(private notificationService: NotificationsService) { }

  ngOnInit(): void {
    this.getMyNotifications();
  }
  getMyNotifications(){
    this.notifiSub = this.notificationService.getMyNotifications().subscribe({
      next: (resData: Notifications)=>{
        this.notifications = resData;        
      },
      error: ()=>{
      }
    })
  }

}
