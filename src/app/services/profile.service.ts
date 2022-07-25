import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { environment as env } from 'src/environments/environment';
import { Profile} from '../user.model';
import { Subject,tap } from 'rxjs';

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
    private _refresh = new Subject<void>();
    get refresh(){
      return this._refresh;
    }
    profileInfo(){
      return this.http.get<Profile>(`${env.api_url}/profile/info`, this.httpOptions)
    }
    editProfile(name:string, email:string, phone: string, birthdate: string){
      return this.http.post(`${env.api_url}/profile/update`,{
        name: name,
        email: email,
        phone: phone,
        birth_date: birthdate
      }, this.httpOptions).pipe(tap(()=>{
        this._refresh.next();
      }))
    }
    deleteAccount(){
      return this.http.get(`${env.api_url}/profile/delete-user-account`,this.httpOptions).pipe(tap(()=>{
        this._refresh.next();
      }))
    }
    updatePhoto(imageUrl: any){
      return this.http.post(`${env.api_url}/profile/update-photo`,{
        image: imageUrl
      },this.httpOptions).pipe(tap(()=>{
        this._refresh.next();
      }))
    }
}
