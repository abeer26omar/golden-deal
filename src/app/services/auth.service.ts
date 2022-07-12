import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { throwError, catchError, tap,Subject} from 'rxjs';
import { environment as env } from 'src/environments/environment';
import { User ,Register} from '../user.model';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = new Subject<User>();

  constructor(private http: HttpClient) { }
  signUp(name: string,gender: string, birth_date:string ,phone: string){
    return this.http.post<Register>(`${env.api_url}/auth/register`,{
      name: name,
      gender: gender,
      birth_date: birth_date,
      phone: phone
    })
    .pipe(catchError(this.handelError))
    
    // tap(resData => {
    //   this.handelAuth(resData.data.user.name, resData.data.user.id, resData.data.token, +resData.data.user.expiresIn)
    //   localStorage.setItem('user', JSON.stringify(resData))
    // }))
  }
  private handelAuth(name: string, id: string, token: string, expiresIn: number){
    
    const experationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(
      name, 
      id,
      token,
      experationDate);
    this.user.next(user)  
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
