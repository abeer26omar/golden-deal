import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { tap,BehaviorSubject, Subject} from 'rxjs';
import { environment as env } from 'src/environments/environment';
import { Register, Login, Verify, OtpForgetPass} from '../models/user.model';
import { ResponseSuccess } from '../models/actions.model';
import { CookieService } from 'ngx-cookie-service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  auth_token: any;
  httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token_deal') || this.cookieService.get('token_deal')}`
    })
  }
  private _isRegister = new BehaviorSubject<boolean>(false);
  isRegister = this._isRegister.asObservable();
  private _refresh = new Subject<void>();
  get refresh(){
    return this._refresh;
  }
  constructor(private http: HttpClient, private cookieService: CookieService) {
    const TOKEN = localStorage.getItem('token_deal') || this.cookieService.get('token_deal');
    this._isRegister.next(!!TOKEN);
  }
  IsloggedIn(){
    return !!localStorage.getItem('token_deal') || this.cookieService.get('token_deal');
  }
  signUp(name: string,phone: string,region_id: number, password: string, password_confirmation: string){
    return this.http.post<Register>(`${env.api_url}/auth/register`,{
      name: name,
      phone: phone,
      region_id: region_id,
      password: password,
      password_confirmation: password_confirmation
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
  signIn(phone: string,password: string){
    return this.http.post<Login>(`${env.api_url}/auth/login`,{
      phone: phone,
      password: password
    })
  }
  getOtpForRestPass(phone: string){
    return this.http.post<OtpForgetPass>(`${env.api_url}/auth/forget-password`,{
      phone: phone
    })
  }
  changePassword(phone: string, password: string, confirmPassword: string){
    return this.http.post<ResponseSuccess>(`${env.api_url}/auth/change-password`, {
      phone: phone,
      password: password,
      password_confirmation: confirmPassword
    })
  }
  logOut(){
    return this.http.get<ResponseSuccess>(`${env.api_url}/auth/logout`, this.httpOptions)
  }
}
  