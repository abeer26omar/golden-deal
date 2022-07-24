import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { environment as env } from 'src/environments/environment';
import { Profile} from '../user.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    })}
  constructor(private http: HttpClient) { }
    profileInfo(){
      return this.http.get<Profile>(`${env.api_url}/profile/info`, this.httpOptions)
    }
    editProfile(name:string, email:string, phone: string, birthdate: string){
      return this.http.post(`${env.api_url}/profile/update`,{
        name: name,
        email: email,
        phone: phone,
        birth_date: birthdate
      }, this.httpOptions)
    }
}
