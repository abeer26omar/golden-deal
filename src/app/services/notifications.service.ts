import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { Notifications } from '../models/actions.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token_deal')}`
    })}
  private _refresh = new Subject<void>();
  get refresh(){
      return this._refresh;
  }
  constructor(private http: HttpClient) { }
  getMyNotifications(){
    return this.http.get<Notifications>(`${env.api_url}/notifications/my-notifications?page=1`, this.httpOptions)
  }
}
