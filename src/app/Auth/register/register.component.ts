import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgOtpInputConfig } from 'ng-otp-input';
import { AuthService } from 'src/app/services/auth.service';
declare var window: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  otpModel: any;
  signin: any;
  signup: any;
  formbox: any;
  timeLeft: number = 60;
  interval: any;
  //register
  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    gender: new FormControl('', [Validators.required]),
    dateOfBirth: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required, Validators.pattern('^[6-9]\d{9}$')]),
    
  });
  //login
  loginForm = new FormGroup({
    phone: new FormControl('',[Validators.required,Validators.pattern('^[6-9]\d{9}$')])
  });

  constructor(private fb: FormBuilder,
    private auth: AuthService, 
    private route: ActivatedRoute,
    private router: Router) { }
    //get forms controls
    get fRegister(){
      return this.registerForm.controls;
    }
    get fLogin(){
      return this.loginForm.controls;
    }

  ngOnInit(): void {
    this.otpModel = new window.bootstrap.Modal(
      document.getElementById('otpModel')
    );
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
  error: string = '';
  submitData() {
    this.otpModel.show();
    this.startTimer();
    // const userName = this.registerForm.get('name')?.value;
    // const userGender = this.registerForm.get('gender')?.value;
    // const userDateOfBirth = this.registerForm.get('dateOfBirth')?.value;
    // const userPhone = this.registerForm.get('phone')?.value;
    console.log(this.registerForm)
    // if(this.registerForm.valid){
    //   // console.log(this.userName, this.userDateOfBirth,this.userGender,this.userPhone);
    //   this.auth.signUp(userName, userGender, userDateOfBirth, userPhone).subscribe(resData =>{
    //     console.log(resData);
    //   },
    //   errorMsg=>{
    //     this.error = errorMsg;
    //   })
    // }
    // else{
    //   return;
    //   // console.log('fill the fucking form!')
    // }
  }
  submitLogin(){
    if(this.loginForm.valid){
      console.log('welcome')
    }
  }
  //otp input
  otp: string ='';
  showOtpComponent = true;
  @ViewChild('ngOtpInput', { static: false}) ngOtpInput: any;
  config:NgOtpInputConfig = {
    allowNumbersOnly: true,
    length: 4,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      'width': '50px',
      'height': '50px'    
    }
  };
  onOtpChange(otp:any) {
    this.otp = otp;
  }
  toggleDisable(){
    if(this.ngOtpInput.otpForm){
      if(this.ngOtpInput.otpForm.disabled){
        this.ngOtpInput.otpForm.enable();
      }else{
        this.ngOtpInput.otpForm.disable();
      }
    }
  }
  //timer to resend
  startTimer() {
    this.interval = setInterval(() => {
      if(this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.timeLeft = 60;
      }
    },1000)
  }

}
