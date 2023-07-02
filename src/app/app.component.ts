import { Component, HostListener, OnInit } from '@angular/core';
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
      if(this.authService.IsloggedIn()){
        this.notificationService.insideChatComponent.subscribe((insideChat)=>{
          if(!insideChat){
            // this.notificationService.requestPermission();
            this.notificationService.getMyNotifications();
          }
        })
      }
  }
}
