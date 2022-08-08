import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { environment as env } from 'src/environments/environment';
import { BehaviorSubject, Observable, Subject,tap } from 'rxjs';
import { io } from "socket.io-client";
import { ResponseSuccess } from '../models/actions.model';


@Injectable({
  providedIn: 'root'
})
export class SocketService {
  httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    })}
  constructor(private http: HttpClient) { }
    private _refresh = new Subject<void>();
    get refresh(){
      return this._refresh;
    }
    sendSupportMsg(message: any){
      return this.http.post<ResponseSuccess>(`${env.api_url}/support/send-message`,
      message,this.httpOptions).pipe(tap(()=>{
        this._refresh.next();
      }))
    }
    getAllSupportMsg(){
      return this.http.get<ResponseSuccess>(`${env.api_url}/support/get-messages`,
      this.httpOptions).pipe(tap(()=>{
        this._refresh.next();
      }))
    }
}
