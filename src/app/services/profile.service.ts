import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { environment as env } from 'src/environments/environment';
import { APIResponse2, Profile, Purchases} from '../models/user.model';
import { Observable, Subject,tap } from 'rxjs';
import { ResponseSuccess } from '../models/actions.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token_deal')}`
    })}
  constructor(private http: HttpClient) { }
    private _refresh = new Subject<void>();
    get refresh(){
      return this._refresh;
    }
    profileInfo(){
      return this.http.get<Profile>(`${env.api_url}/profile/info`, this.httpOptions)
    }
    editProfile(name:string, email:string, phone: string, birthdate: any){
      return this.http.post<ResponseSuccess>(`${env.api_url}/profile/update`,{
        name: name,
        email: email,
        phone: phone,
        birth_date: birthdate
      }, this.httpOptions).pipe(tap(()=>{
        this._refresh.next();
      }))
    }
    deleteAccount(){
      return this.http.get<ResponseSuccess>(`${env.api_url}/profile/delete-user-account`,this.httpOptions).pipe(tap(()=>{
        this._refresh.next();
      }))
    }
    updatePhoto(imageUrl: any){
      return this.http.post<ResponseSuccess>(`${env.api_url}/profile/update-photo`,imageUrl
      ,this.httpOptions).pipe(tap(()=>{
        this._refresh.next();
      }))
    }
    buyingRecord(): Observable<APIResponse2<Purchases>>{
      return this.http.get<APIResponse2<Purchases>>(`${env.api_url}/purchase-history`,this.httpOptions)
    }
    updateCover(coverUrl: any){
      return this.http.post<ResponseSuccess>(`${env.api_url}/portfolio/update-cover`,coverUrl
      ,this.httpOptions).pipe(tap(()=>{
        this._refresh.next();
      }))
    }
}
