import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from 'src/environments/environment';
import { BehaviorSubject, Subject } from 'rxjs';
import { Notifications } from '../models/actions.model';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  currentMessage = new BehaviorSubject<any>(null)
  private _notCounter = new BehaviorSubject<boolean>(false);
  notCounter = this._notCounter.asObservable();

  httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token_deal') || this.cookieService.get('token_deal')}`
    })}

  private _refresh = new Subject<void>();
  get refresh(){
      return this._refresh;
  }
  _insideChatComponent = new BehaviorSubject<boolean>(false);
  insideChatComponent = this._insideChatComponent.asObservable();

  constructor(private http: HttpClient,
    private angularFireMessaging: AngularFireMessaging,
    private cookieService: CookieService) { 
  }
  getMyNotifications(pageNo: number = 1){
    return this.http.get<Notifications>(`${env.api_url}/notifications/my-notifications?page=${pageNo}`, this.httpOptions)
  }
  requestPermission(){
    this.angularFireMessaging.requestToken.subscribe(
      {        
        next: (token)=>{
          this.http.post(`${env.api_url}/notifications/store-fcm`,{
            fcm_token: token
          }, this.httpOptions).subscribe({
            next: (res)=>{
              // console.log(res);
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
  updateNotiBadge(status: boolean) {
    this._notCounter.next(status);

  }
  getNotification(){
    this.angularFireMessaging.messages.subscribe(
      (payload)=>{  
        this.currentMessage.next(payload);
        this.updateNotiBadge(true)
      })
  }
}
