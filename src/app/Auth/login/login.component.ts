import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Login } from 'src/app/models/user.model';
import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { ActionsService } from 'src/app/services/actions.service';
import { Regions } from 'src/app/models/actions.model';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { MatDialog } from '@angular/material/dialog';
import { ResetPassModalComponent } from '../reset-pass-modal/reset-pass-modal.component';
import { CookieService } from 'ngx-cookie-service';
declare var window: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../register/register.component.css'],
  providers:[DatePipe,CookieService]

})
export class LoginComponent implements OnInit, OnDestroy {
  userData : Login = {
    data:{
      user: {
          id: 0,
          name: '',
          email: '',
          phone: '',
          image: '',
          cover: '',
          subscribed: 0,
          is_admin: 0,
          birth_date: '',
          gender: '',
          otp: 0,
          fcm_token: null,
          email_verified_at: null,
          image_url: '',
          cover_url: '',
          region_id: ''
      },
      token: ''
    },
    status_msg: ''
  }
  hide = true;
  hideConf = true;
  error: string = '';
  errorLogin: string = '';
  loader: boolean = false;
  loaderLogin: boolean = false;
  resMsg: boolean = false;
  token: any;
  id: any;
  region_id!: string;
  succMsg: string = '';
  login: boolean = false;
  mac: boolean = false;
  regions: any = [];

  private authSub : Subscription = new Subscription;
  private actionSub : Subscription = new Subscription;

  //login
  loginForm = new FormGroup({
    phone: new FormControl('',[Validators.required]),
    userPassword: new FormControl('',[Validators.required])
  });

  constructor(private auth: AuthService, 
    private router: Router,
    private actionService: ActionsService,
    private errorHandel: ErrorHandlerService,
    private dialogRef: MatDialog,
    private cookieService: CookieService) { }
    
    get fLogin(){
      return this.loginForm.controls;
    }
  getRegions(){
    this.actionSub = this.actionService.getRegions().subscribe({
      next: (res: Regions) => {
        this.regions = res.data        
      },
      error: (err: HttpErrorResponse)=>{
        this.errorHandel.openErrorModa(err);
      }
    })
  }
  ngOnInit(): void {
    this.getRegions();
  }
  getErrorPhone(){
    const phoneControl = this.loginForm.get('phone');
    if (phoneControl?.hasError('required')) {
      return 'يجب ادخال رقم الهاتف';
    }else{
      return '';
    }
  }
  getErrorPassword(){
    if (this.fLogin['password'].hasError('required')) {
      return 'يجب ادخال كلمه السر';
    }else{
      return '';
    }
  }
  submitLogin(){
    const phoneNo = '+966' + this.loginForm.get('phone')?.value;
    const userPassword = this.loginForm.get('userPassword')?.value;
    if(this.loginForm.valid){
      this.loaderLogin = true;
      this.errorLogin = '';    
      this.authSub = this.auth.signIn(phoneNo,userPassword).subscribe({
        next: (resData: Login) =>{
          this.token = resData.data.token;
          this.id = resData.data.user.id;
          this.region_id = resData.data.user.region_id;
          this.loaderLogin = false;
          this.userData = resData;
          this.login = true;
          // this.openOtpModal();
          localStorage.setItem('token_deal', this.token);
          localStorage.setItem('userId', JSON.stringify(this.id));
          localStorage.setItem('region_id', this.region_id);
          localStorage.setItem('userImage', resData.data.user.image_url);
          // Save data into cookies
          this.cookieService.set('token_deal', this.token, 24);
          this.cookieService.set('userId', JSON.stringify(this.id), 24);
          this.cookieService.set('region_id', this.region_id, 24);
          this.cookieService.set('userImage', resData.data.user.image_url, 24);
          this.actionService.handelRes(resData.status_msg);
          setTimeout(()=>{
            this.router.navigate(['/'])
            setTimeout(()=>{
              window.location.reload();
            },0)
          },50)
        },
        error: (err: HttpErrorResponse)=>{
          this.loaderLogin = false;
          localStorage.clear();
          this.cookieService.deleteAll();
          this.errorHandel.openErrorModa(err);
        }
      })
    }
  }
  // reset password
  openRestPassDialog(){
    this.dialogRef.open(ResetPassModalComponent,{
      width: '500px',
      enterAnimationDuration: '800ms',
      exitAnimationDuration: '500ms',
    })
  }

  ngOnDestroy() :void{
    if(this.authSub){
      this.authSub.unsubscribe();
    }
    if(this.actionSub){
      this.actionSub.unsubscribe();
    }
  }
}