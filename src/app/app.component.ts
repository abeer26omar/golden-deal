import { Component, HostListener, Input, OnInit, Output } from '@angular/core';
import { AuthService } from './services/auth.service';
import { NotificationsService } from './services/notifications.service';
import { ClearStorageService } from './services/clear-storage.service'
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
  backdrops = Array.from(document.getElementsByClassName('modal-backdrop') as HTMLCollectionOf<HTMLElement>) 
  toggle(){
    this.sidebarOpen = !this.sidebarOpen;
  }
  close(){
    this.sidebarOpen = !this.sidebarOpen;
  }
  constructor(public authService: AuthService,
    private notificationService: NotificationsService,
    private ClearStorageService: ClearStorageService){
      this.hidebackdrop()
    }
    hidebackdrop(){
      this.backdrops.forEach(element => {
        element.style.opacity = '1';
      });
    }
    ngOnInit(): void {
      this.not_count = 0
      if(this.authService.IsloggedIn()){
        this.not_count += this.not_count;
        this.notificationService.insideChatComponent.subscribe((insideChat)=>{
          if(!insideChat){
            this.notificationService.requestPermission();
            this.not_count += this.not_count;
            this.notificationService.getMyNotifications();
          }
        })
      }
  }
}
