import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgOtpInputConfig } from 'ng-otp-input';
import { AuthService } from 'src/app/services/auth.service';
import { Login, Verify } from 'src/app/models/user.model';
import { HttpErrorResponse } from '@angular/common/http';
import { MacPrefixService } from 'src/app/services/mac-prefix.service';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { ActionsService } from 'src/app/services/actions.service';
import { Regions } from 'src/app/models/actions.model';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { MatDialog } from '@angular/material/dialog';
import { ResetPassModalComponent } from '../reset-pass-modal/reset-pass-modal.component';
import { MustMatchService } from 'src/app/services/must-match.service';
import { CookieService } from 'ngx-cookie-service';

declare var window: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers:[DatePipe,CookieService]
})
export class RegisterComponent implements OnInit, OnDestroy {
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
  otpModal: any;
  signin: any;
  signup: any;
  formbox: any;
  timeLeft: number = 60;
  interval: any;
  error: string = '';
  errorOtp: string = '';
  errorLogin: string = '';
  loader: boolean = false;
  loaderOtp: boolean = false;
  loaderLogin: boolean = false;
  subOtp: boolean = true;
  resend:boolean = true;
  resMsg: boolean = false;
  token: any;
  id: any;
  region_id!: string;
  succMsg: string = '';
  login: boolean = false;
  mac: boolean = false;
  regions: any = [];
  //register
  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required,Validators.minLength(3)]),
    password: new FormControl('', [Validators.required,Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required,Validators.minLength(6)]),
    phone: new FormControl('', [Validators.required, Validators.pattern("[0-9]{9}")]),
    region: new FormControl('', [Validators.required]),
    check: new FormControl('')
  },{ validators: [this.passMatchService.mustMatch('password', 'confirmPassword'),
      this.passMatchService.nonZero('phone')]}
  );

  private authSub : Subscription = new Subscription;
  private actionSub : Subscription = new Subscription;

  //login
  loginForm = new FormGroup({
    phone: new FormControl('',[Validators.required, Validators.pattern("[0-9]{9}")]),
    userPassword: new FormControl('',[Validators.required])
  });

  constructor(private auth: AuthService, 
    private router: Router,
    private macService: MacPrefixService,
    private passMatchService: MustMatchService,
    private actionService: ActionsService,
    private errorHandel: ErrorHandlerService,
    private dialogRef: MatDialog,
    private cookieService: CookieService) { }
    //get forms controls
    get fRegister(){
      return this.registerForm.controls;
    }
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
    this.otpModal = new window.bootstrap.Modal(
    document.getElementById('otpModel'),{backdrop: this.macService.backdrop});
    this.signup = document.getElementById('signup');
    this.mac = this.macService.macphone;
    this.getRegions();
  }
  getErrorPassword(){
    // console.log(this.fRegister['password']);
    if (this.fRegister['password'].hasError('required')) {
      return 'يجب ادخال كلمه السر';
    }

    return this.fRegister['password'].hasError('minlength') ? 'كلمه السر يجب ان لا تقل عن 6 احرف' : '';
  }
  getErrorConfirmPass(){
    // console.log(this.fRegister['confirmPassword']);
    if (this.fRegister['confirmPassword'].hasError('required')) {
      return 'يجب تأكيد كلمه السر';
    }
    
    return this.fRegister['confirmPassword'].hasError('mustMatch') ? 'كلمه السر غير متطابقه ' : '';
  }
  getErrorStartZero(){
    const phoneControl = this.registerForm.get('phone');
    if (phoneControl?.hasError('required')) {
      return 'يجب ادخال رقم الهاتف';
    } else if (phoneControl?.hasError('pattern')) {
      return 'ارقام سعوديه فقط';
    } else {
      const nonZeroError = phoneControl?.getError('nonZero');
      return nonZeroError ? 'ادخل رقم الهاتف بدون 0' : '';
    }
  }
  getErrorName(){
    if (this.fRegister['name'].hasError('required')) {
      return 'يجب ادخال اسم المستخدم';
    }
      return this.fRegister['name'].hasError('minlength') ? ' اسم المستخدم يجب ان لا يقل عن 3 احرف' : '';
  }
  submitData() {
    const userPhone = '+966' + this.registerForm.get('phone')?.value;
    const userName = this.registerForm.get('name')?.value;
    const region_id = this.registerForm.get('region')?.value;
    const userPass = this.registerForm.get('password')?.value;
    const userConfPass = this.registerForm.get('confirmPassword')?.value;
    if(this.registerForm.valid){      
      this.loader = true;
      this.error = '';      
      this.authSub = this.auth
      .signUp(userName, userPhone, region_id, userPass, userConfPass)
      .subscribe({
        next: resData =>{
            this.token = resData.data.token;
            this.id = resData.data.user.id;
            this.region_id = resData.data.user.region_id
            this.loader = false;
            this.openOtpModal();
            this.openOtpModal();
        },
        error: (err: HttpErrorResponse) =>{
            this.loader = false;
            localStorage.clear();
            this.cookieService.deleteAll();
            this.errorHandel.openErrorModa(err);
          }
      })  
    }
    else{ 
      return;
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
  //otp input
  otp!: number ;
  showOtpComponent = true;
  config:NgOtpInputConfig = {
    allowNumbersOnly: true,
    length: 4,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    containerStyles:{
      'direction': 'ltr'
    }  
  };
  onOtpChange(otp:any) {
    this.otp = otp;
    if(otp.length == 4){
      this.subOtp = !this.subOtp;
    }
  }
  // timer to resend
  startTimer() {
    this.interval = setInterval(() => {
      if(this.timeLeft > 0) {
        this.timeLeft--;
      } else{
        this.resend = false;
      }
    },1000)
  }
  onOtpSubmmit(){
    this.succMsg ='';
    const otp = this.otp;
    this.loaderOtp = true;
    this.authSub = this.auth.otpVerify(otp,this.token,this.id).subscribe({
    next:(res: Verify)=>{
      this.succMsg = res.data;
      this.loaderOtp = false;
      this.login = true;
      localStorage.setItem('token_deal', this.token);
      localStorage.setItem('userId', JSON.stringify(this.id));
      localStorage.setItem('region_id', this.region_id);
      localStorage.setItem('userImage', this.userData.data.user.image_url);
      // Save data into cookies
      this.cookieService.set('token_deal', this.token, 24);
      this.cookieService.set('userId', JSON.stringify(this.id), 24);
      this.cookieService.set('region_id', this.region_id, 24);
      this.cookieService.set('userImage', this.userData.data.user.image_url, 24);;
      const loginTime = new Date().getTime();
      localStorage.setItem('loginTime', loginTime.toString());
      setTimeout(()=>{
        this.otpModal.hide();
        this.router.navigate(['/'])
        setTimeout(()=>{
          window.location.reload();
        },0)
      },50)
    },
    error: (err: HttpErrorResponse) =>{
      this.loaderOtp = false;
      this.errorOtp = err.error.data
      localStorage.clear();
      this.cookieService.deleteAll();
    }
   })
  }
  openOtpModal(){
    this.otpModal.show();
    this.startTimer();
  }
  resendOtp(){
    this.loaderOtp = true;
    this.authSub = this.auth.resendOtp(this.token).subscribe({
      next: (res: Verify)=>{
        this.succMsg = res.data;
        this.resMsg = true ;
        this.loaderOtp = false;
        setTimeout(()=>{
          this.resMsg = false;
          this.resend = true;
          this.timeLeft = 60;
        },1500)
      },
      error: (err: HttpErrorResponse)=>{
        this.loaderOtp = false;
        localStorage.clear();
        this.cookieService.deleteAll();
        this.errorHandel.openErrorModa(err);
      }
    })
  }
  closeOtp(){
    this.timeLeft = 60;
    this.otpModal.hide();
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
