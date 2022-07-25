import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Golden-deal';
  // loadMatSpinner :boolean = true;
  constructor(public authService: AuthService){
    // setTimeout(() => {
    //   this.loadMatSpinner = false;
    // }, 1000);
  }
  
}
