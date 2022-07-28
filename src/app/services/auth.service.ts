import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { throwError, catchError, tap,BehaviorSubject, Subject} from 'rxjs';
import { environment as env } from 'src/environments/environment';
import { Register, Login} from '../models/user.model';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  auth_token: any;
  private _isRegister = new BehaviorSubject<boolean>(false);
  isRegister = this._isRegister.asObservable();
  private _refresh = new Subject<void>();
  get refresh(){
    return this._refresh;
  }
  constructor(private http: HttpClient) {
    const TOKEN = localStorage.getItem('token');
    this._isRegister.next(!!TOKEN)
  }
  IsloggedIn(){
    return !!localStorage.getItem('token')
  }
  signUp(name: string,gender: string, birth_date:string ,phone: string){
    return this.http.post<Register>(`${env.api_url}/auth/register`,{
      name: name,
      gender: gender,
      birth_date: birth_date,
      phone: phone
    })
    .pipe(catchError(this.handelError)
    , tap(() => {
      this._isRegister.next(true);
      this._refresh.next();
    }))
  }
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    })}

  otpVerify(otp:number){
    return this.http.post(`${env.api_url}/auth/verify-otp`,{
      otp: otp
    }, this.httpOptions)
  }
  resendOtp(){
    return this.http.get(`${env.api_url}/auth/resend-otp`,this.httpOptions)
  }
  signIn(phone: string){
    return this.http.post<Login>(`${env.api_url}/auth/login`,{
      phone: phone
    }).pipe(tap(()=>{
      this._isRegister.next(true);
      this._refresh.next();
    }))
  }
  logOut(){
    return this.http.get(`${env.api_url}/auth/logout`, this.httpOptions)
  }
  private handelError(errorRes: HttpErrorResponse){
    let errorMsg = 'An unknown Error Occurred';

      if(errorRes.error.data == 'الهاتف لابد ان يكون ارقام'){
          errorMsg = 'الهاتف لابد ان يكون ارقام'
          // console.log(errorMsg)
        return throwError(errorMsg);
      } 
      else (errorRes.error.data == 'رقم الهاتف موجود بالفعل') 
         errorMsg = `رقم الهاتف موجود بالفعل` 
          //  return console.log(errorMsg)
        return throwError(errorMsg);
  }
  }
  