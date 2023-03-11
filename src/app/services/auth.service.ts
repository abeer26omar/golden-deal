import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { throwError, catchError, tap,BehaviorSubject, Subject} from 'rxjs';
import { environment as env } from 'src/environments/environment';
import { Register, Login, Verify} from '../models/user.model';
import { ResponseSuccess } from '../models/actions.model';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  auth_token: any;
  httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token_deal')}`
    })
  }
  private _isRegister = new BehaviorSubject<boolean>(false);
  isRegister = this._isRegister.asObservable();
  private _refresh = new Subject<void>();
  get refresh(){
    return this._refresh;
  }
  constructor(private http: HttpClient) {
    const TOKEN = localStorage.getItem('token_deal');
    this._isRegister.next(!!TOKEN)
  }
  IsloggedIn(){
    return !!localStorage.getItem('token_deal')
  }
  signUp(name: string,gender: string, birth_date:any ,phone: string){
    return this.http.post<Register>(`${env.api_url}/auth/register`,{
      name: name,
      gender: gender,
      birth_date: birth_date,
      phone: phone
    })
  }
  otpVerify(otp: number,token: any,id?:any){
    const headers = new HttpHeaders ({
      'Authorization': `Bearer ${token}`
    }) 
    return this.http.post<Verify>(`${env.api_url}/auth/verify-otp`,{
      otp: otp
    },{headers}).pipe(tap(()=>{
      this._isRegister.next(true);
    }))
  }
  resendOtp(token: any){
    const headers = new HttpHeaders ({
      'Authorization': `Bearer ${token}`
    }) 
    return this.http.get<Verify>(`${env.api_url}/auth/resend-otp`,{headers})
  }
  signIn(phone: string){
    return this.http.post<Login>(`${env.api_url}/auth/login`,{
      phone: phone
    })
  }
  logOut(){
    return this.http.get<ResponseSuccess>(`${env.api_url}/auth/logout`, this.httpOptions)
  }
}
  