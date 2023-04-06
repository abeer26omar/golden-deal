import { Component, OnInit } from '@angular/core';
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
declare var window: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers:[DatePipe]
})
export class RegisterComponent implements OnInit {
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
  }
  }
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
    name: new FormControl('', [Validators.required]),
    gender: new FormControl('', [Validators.required]),
    dateOfBirth: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required, Validators.pattern("[0-9]{9}")]),
    region: new FormControl('', [Validators.required])
  });
  private authSub : Subscription = new Subscription;
  private actionSub : Subscription = new Subscription;

  //login
  loginForm = new FormGroup({
    phone: new FormControl('',[Validators.required, Validators.pattern("[0-9]{9}")])
  });

  constructor(private auth: AuthService, 
    private router: Router,
    private macService: MacPrefixService,
    private datePipe: DatePipe,
    private actionService: ActionsService) { 
    }
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
      }
    })
  }
  ngOnInit(): void {
    this.otpModal = new window.bootstrap.Modal(
      document.getElementById('otpModel'),{backdrop: this.macService.backdrop});
    this.signin = document.getElementById('signin');
    this.signup = document.getElementById('signup');
    this.formbox = document.querySelector('.form');
    this.signin.addEventListener('click',(e:any)=>{
      e.preventDefault();
        this.formbox.classList.add('active');
    });
    this.signup.addEventListener('click',(e:any)=>{
      e.preventDefault();
        this.formbox.classList.remove('active');
    })
    this.mac = this.macService.macphone;
    this.getRegions();
  }
  submitData() {
    const userName = this.registerForm.get('name')?.value;
    const userGender = this.registerForm.get('gender')?.value;
    const userDateOfBirth = this.datePipe.transform(this.registerForm.get('dateOfBirth')?.value,"yyyy-MM-dd");
    const userPhone = '+966' + this.registerForm.get('phone')?.value;
    const region_id = this.registerForm.get('region')?.value;
    if(this.registerForm.valid){
      this.loader = true;
      this.error = '';      
      this.authSub = this.auth
      .signUp(userName, userGender, userDateOfBirth, userPhone, region_id)
      .subscribe({
        next: resData =>{
            this.token = resData.data.token;
            this.id = resData.data.user.id;
            this.region_id = resData.data.user.region_id
            this.loader = false;
            this.openOtpModal();             
        },
        error: () =>{
            this.loader = false;
            localStorage.clear();
          }
      })  
    }
    else{ 
      return;
    }    
  }
  submitLogin(){
    const phoneNo = '+966' + this.loginForm.get('phone')?.value  ;
    if(this.loginForm.valid){
      this.loaderLogin = true;
      this.errorLogin = '';    
      this.authSub = this.auth.signIn(phoneNo).subscribe({
        next: (resData: Login) =>{
          this.token = resData.data.token;
          this.id = resData.data.user.id;
          this.region_id = resData.data.user.region_id;
          this.loaderLogin = false;
          this.userData = resData;
          this.openOtpModal(); 
          this.login = true;
        },
        error: ()=>{
          this.loaderLogin = false;
          localStorage.clear();
        }
      })
    }
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
  //timer to resend
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
      localStorage.setItem('region_id', this.region_id)
      setTimeout(()=>{
        this.otpModal.hide();
        this.router.navigate(['/home'])
        setTimeout(()=>{
          window.location.reload();
        },50)
      },50)
    },
    error: () =>{
      this.loaderOtp = false;
      localStorage.clear();
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
        localStorage.clear()
      }
    })
  }
  closeOtp(){
    this.timeLeft = 60;
    this.otpModal.hide();
  }
  ngOnDestory() :void{
    if(this.authSub){
      this.authSub.unsubscribe();
    }
    if(this.actionSub){
      this.actionSub.unsubscribe();
    }
  }
}
