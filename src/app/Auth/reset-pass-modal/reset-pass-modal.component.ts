import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgOtpInputConfig } from 'ng-otp-input';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { OtpForgetPass } from 'src/app/models/user.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ResponseSuccess } from 'src/app/models/actions.model';
import { MustMatchService } from 'src/app/services/must-match.service';

@Component({
  selector: 'app-reset-pass-modal',
  templateUrl: './reset-pass-modal.component.html',
  styleUrls: ['./reset-pass-modal.component.css']
})
export class ResetPassModalComponent implements OnInit, OnDestroy {
  private authSub : Subscription = new Subscription;
  result: string = '';
  resultErr: string = '';
  resultOtP: string = '';
  resultErrOtp: string = '';
  code!: number;
  spinOtp: boolean = false;
  submitOtp: boolean = false;
  hide: boolean = true;
  hideConf: boolean = true;
  submitNewPass: boolean = false;
  resultSuccess: string = '';
  resultError: string = '';
  constructor(@Inject(MAT_DIALOG_DATA) public data: {name: string},
    public dialogRef: MatDialogRef<MatDialogClose>,
    private auth: AuthService, 
    private passMatchService: MustMatchService) { }

  ngOnInit(): void {
  }
  phoneSendForm = new FormGroup({
    phone: new FormControl('',[Validators.required, Validators.pattern("[0-9]{9}")]),
  });
  newPasswordForm = new FormGroup({
    password: new FormControl('', [Validators.required,Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required,Validators.minLength(6)])
  },{ validators: this.passMatchService.mustMatch('password', 'confirmPassword') });

  otpForm = new FormGroup({
    otpControl: new FormControl('',[Validators.required])
  })
  get FphoneSend(){
    return this.phoneSendForm.controls;
  }
  get FnewPassword(){
    return this.newPasswordForm.controls;
  }
  getErrorPassword(){
    // console.log(this.fRegister['password']);
    if (this.FnewPassword['password'].hasError('required')) {
      return 'يجب ادخال كلمه السر';
    }

    return this.FnewPassword['password'].hasError('minlength') ? 'كلمه السر يجب ان لا تقل عن 6 احرف' : '';
  }
  getErrorConfirmPass(){
    // console.log(this.fRegister['confirmPassword']);
    if (this.FnewPassword['confirmPassword'].hasError('required')) {
      return 'يجب تأكيد كلمه السر';
    }
    return this.FnewPassword['confirmPassword'].hasError('mustMatch') ? 'كلمه السر غير متطابقه ' : '';
  }
  sendOtp(stepper: MatStepper){
    this.result = '';
    this.resultErr = '';
    const userPhone = '+966' + this.phoneSendForm.get('phone')?.value;
    if(this.phoneSendForm.valid){
      this.spinOtp = true
      this.authSub = this.auth.getOtpForRestPass(userPhone).subscribe({
        next: (res: OtpForgetPass)=>{
          this.spinOtp = false;
          this.result = res.data.msg;
          this.code = res.data.code;
          setTimeout(()=>{
            this.goForward(stepper)
          },800)
        },
        error: (err: HttpErrorResponse)=>{
          this.spinOtp = false;
          this.resultErr = err.error.data;
        }
      })
    }else{
      return;
    }
    
  }
  goBack(stepper: MatStepper){
      stepper.previous();
  }
  goForward(stepper: MatStepper){
      stepper.next();
  }
  otp!: number ;
  subOtp: boolean = true;
  config: NgOtpInputConfig = {
    allowNumbersOnly: true,
    length: 4,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    containerStyles:{
      'direction': 'ltr',
      'text-align': 'center'
    }  
  };
  onOtpChange(otp:any) {
    this.otp = otp;
    if(otp.length == 4){
      this.subOtp = !this.subOtp;
    }
  }
  onOtpSubmmit(stepper: MatStepper){
    this.submitOtp = true;
    this.resultOtP = ''
    this.resultErrOtp = ''
    this.otpForm.get('otpControl')?.setValue('')
    setTimeout(()=>{
      if(this.otp == this.code){
        this.submitOtp = false;
        this.resultOtP = 'تم التحقق من الرمز بنجاح';
        this.otpForm.get('otpControl')?.setValue(this.otp)
        setTimeout(()=>{
          this.goForward(stepper)
        },800)
      }else{
        this.submitOtp = true;
        this.otpForm.get('otpControl')?.setValue('')
        this.resultErrOtp = 'الرمز غير صحيج';
        setTimeout(()=>{
          this.goBack(stepper)
        },800)
      }    
    },1000)
  }
  setNewPassword(stepper: MatStepper){
    this.resultError = '';
    this.resultSuccess = '';
    const userPhone = '+966' + this.phoneSendForm.get('phone')?.value;
    const userPass = this.newPasswordForm.get('password')?.value;
    const userConfPass = this.newPasswordForm.get('confirmPassword')?.value;
    if(this.newPasswordForm.valid){
      this.submitNewPass = true;
      this.authSub = this.auth.changePassword(userPhone, userPass, userConfPass).subscribe({
        next: (res: ResponseSuccess)=>{
          this.submitNewPass = false;
          this.resultSuccess = res.data;
          setTimeout(()=>{
            this.dialogRef.close();
          },500)          
        },
        error: (err: HttpErrorResponse)=>{
          this.submitNewPass = false;
          this.resultError = err.error.data;          
        }
      })
    }else{
      return;
    }
  }
  ngOnDestroy() :void{
    if(this.authSub){
      this.authSub.unsubscribe();
    }
  }
}
