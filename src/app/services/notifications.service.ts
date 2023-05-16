import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from 'src/environments/environment';
import { BehaviorSubject, Subject } from 'rxjs';
import { Notifications } from '../models/actions.model';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  currentMessage = new BehaviorSubject<any>(null)
  httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token_deal')}`
    })}
  private _refresh = new Subject<void>();
  get refresh(){
      return this._refresh;
  }
  constructor(private http: HttpClient,
    private angularFireMessaging: AngularFireMessaging) { }
  getMyNotifications(){
    return this.http.get<Notifications>(`${env.api_url}/notifications/my-notifications?page=1`, this.httpOptions)
  }
  requestPermission(){
    this.angularFireMessaging.requestToken.subscribe(
      {        
        next: (token)=>{
          console.log(token)
          this.http.post(`${env.api_url}/notifications/store-fcm`,{
            fcm_token: token
          }, this.httpOptions).subscribe({
            next: (res)=>{
              console.log(res);
            },
            error: (err)=>{
              console.log(err);
            }
          })
        },
        error: (err)=>{
          console.log(err);
        }
      }
    )
  }
  getNotifications(){
    this.angularFireMessaging.messages.subscribe((payload)=>{      
      this.currentMessage.next(payload)
    })
  }
}
