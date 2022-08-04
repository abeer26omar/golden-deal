import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgOtpInputConfig } from 'ng-otp-input';
import { AuthService } from 'src/app/services/auth.service';
import { Login } from 'src/app/models/user.model';
declare var window: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
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
          cover_url: ''
      },
      token: ''
  }
  }
  otpModal: any;
  successModal: any;
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

  //register
  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    gender: new FormControl('', [Validators.required]),
    dateOfBirth: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    // , Validators.pattern('^[6-9]\d{9}$')
  });
  
  //login
  loginForm = new FormGroup({
    phone: new FormControl('',[Validators.required])
  });

  constructor(private auth: AuthService, 
    private route: ActivatedRoute,
    private router: Router) { 
      this.auth.refresh.subscribe(()=>{
        this.submitData();
        this.submitLogin();
      })
    }
    //get forms controls
    get fRegister(){
      return this.registerForm.controls;
    }
    get fLogin(){
      return this.loginForm.controls;
    }
    
  ngOnInit(): void {
    this.otpModal = new window.bootstrap.Modal(
      document.getElementById('otpModel')
    );
    this.successModal = new window.bootstrap.Modal(
      document.getElementById('success')
    )
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

  }
  submitData() {
    const userName = this.registerForm.get('name')?.value;
    const userGender = this.registerForm.get('gender')?.value;
    const userDateOfBirth = this.registerForm.get('dateOfBirth')?.value;
    const userPhone = this.registerForm.get('phone')?.value;
    if(this.registerForm.valid){
      this.loader = true;
      this.error = '';
      this.auth
      .signUp(userName, userGender, userDateOfBirth, userPhone)
      .subscribe({
        next: resData =>{
            this.loader = false;
            this.openOtpModal(); 
            localStorage.setItem('token', this.userData.data.token); 
            localStorage.setItem('userId', JSON.stringify(this.userData.data.user.id));
        },
        error: errorMsg =>{
            this.loader = false;
            this.error = errorMsg;
            localStorage.clear()
          }
      })  
    }
    else{ 
      return;
    }    
  }
  submitLogin(){
    const phoneNo = this.loginForm.get('phone')?.value;
    if(this.loginForm.valid){
      this.loaderLogin = true;
      this.errorLogin = '';    
      this.auth.signIn(phoneNo).subscribe({
        next: (resData: Login) =>{
          this.loaderLogin = false;
          this.userData = resData;
          localStorage.setItem('token', this.userData.data.token);
          localStorage.setItem('userId', JSON.stringify(this.userData.data.user.id));
          window.location.reload();
         },
        error: ()=>{
          this.loaderLogin = false;
          this.errorLogin =" هذا الحساب غير موجود";
          localStorage.clear();
        }
      })
    }
  }
  //otp input
  otp!: number ;
  showOtpComponent = true;
  @ViewChild('ngOtpInput', { static: false}) ngOtpInput: any;
  config:NgOtpInputConfig = {
    allowNumbersOnly: true,
    length: 4,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: ''
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
    const otp = this.otp;
    this.loaderOtp = true;
    this.auth.otpVerify(otp).subscribe({
    next:()=>{
      this.loaderOtp = false;
      this.openSuccessModal();
      localStorage.setItem('token', this.userData.data.token);
      localStorage.setItem('userId', JSON.stringify(this.userData.data.user.id));
      setTimeout(()=>{
        this.successModal.hide();
        this.router.navigate(['/home'])
      },1000)
      window.location.reload();
    },
    error: () =>{
      this.loaderOtp = false;
      this.errorOtp = 'الكود الذى ادخلته غير صحيح';
      localStorage.clear();
    }
   })
  }
  openOtpModal(){
    this.otpModal.show();
    this.startTimer();
  }
  openSuccessModal(){
    this.otpModal.hide();
    this.successModal.show();
  }
  resendOtp(){
    this.loaderOtp = true;
    this.auth.resendOtp().subscribe({
      next: (res)=>{
        this.resMsg = true ;
        this.loaderOtp = false;
        setTimeout(()=>{
          this.resMsg = false;
          this.resend = true;
          this.timeLeft = 60;
        },1500)
      },
      error: error=>{
        this.loaderOtp = false;
        localStorage.clear()
      }
    })
  }
}
