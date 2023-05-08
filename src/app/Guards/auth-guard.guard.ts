import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthRemainderModalComponent } from '../auth-remainder-modal/auth-remainder-modal.component';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate {
  constructor(private auth:AuthService, 
    private route: Router,private dialogRef: MatDialog){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(this.auth.IsloggedIn()){
        return true;
      } else{
        this.dialogRef.open(AuthRemainderModalComponent,{
          data: {}
        })
        // this.route.navigate(['/register']);
        return false;
      }
  }
  
}
