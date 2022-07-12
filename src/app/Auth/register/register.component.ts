import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
declare var window: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  otpModel: any;

  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    gender: new FormControl('', [Validators.required]),
    dateOfBirth: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    
  });
  constructor(private fb: FormBuilder,
    private auth: AuthService, 
    private route: ActivatedRoute,
    private router: Router) { }
    get f(){
      return this.registerForm.controls;
    }
  ngOnInit(): void {
    this.otpModel = new window.bootstrap.Modal(
      document.getElementById('otpModel')
    );
  }
  error: string = '';
  submitData() {
    this.otpModel.show();
    // const userName = this.registerForm.get('name')?.value;
    // const userGender = this.registerForm.get('gender')?.value;
    // const userDateOfBirth = this.registerForm.get('dateOfBirth')?.value;
    // const userPhone = this.registerForm.get('phone')?.value;
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

}
