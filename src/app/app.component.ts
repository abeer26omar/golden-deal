import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
declare var window: any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Golden-deal';
  sidebarOpen = true;
  backdrops = Array.from(document.getElementsByClassName('modal-backdrop') as HTMLCollectionOf<HTMLElement>) 
  toggle(){
    this.sidebarOpen = !this.sidebarOpen;
  }
  close(){
    this.sidebarOpen = !this.sidebarOpen;
  }
  constructor(public authService: AuthService){
    this.hidebackdrop()
  }
  hidebackdrop(){
    this.backdrops.forEach(element => {
      element.style.opacity = '1';
    });
  }
}
