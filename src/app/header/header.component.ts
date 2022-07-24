import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  panelOpenState = false;
  constructor(public authService: AuthService,
    private route: Router,
    private profileService: ProfileService ) { 
  }

  ngOnInit(): void {
  }
  logOut(){
    this.authService.logOut().subscribe({
      next:(res)=>{
        console.log(res)
        localStorage.clear();
      },
      error: (err)=>{
        console.log(err)
      }
    })
  }
}
