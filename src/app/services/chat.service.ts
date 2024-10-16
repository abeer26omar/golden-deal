import { Injectable } from '@angular/core';
import { environment as env } from 'src/environments/environment';
import { io, Socket } from 'socket.io-client';
import { Observable, Subject, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Messages, MessagesList, Support } from '../models/chat.model';
import { ResponseSuccess } from '../models/actions.model';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket!: Socket;
  userData: any;
  httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token_deal') || this.cookieService.get('token_deal')}`,
    })
  }
  private _refresh = new Subject<void>();
  get refresh(){
    return this._refresh;
  }
  allSupportMsg!: Support;
  constructor(private http: HttpClient, private cookieService: CookieService) {
  }
  connect(userId: number): void{  
    this.socket = io(env.socket_url);
    this.socket.on('connect', () => {
      this.socket.emit('user_connected', {userid: userId});
    });
    this.socket.on('disconnect', () => {
      console.log('Socket is disconnected');
    });
  }
  sendMessage(data: any){
    this.socket.emit('send_message', {sender: data.sender, receiver: data.receiver, message: data.message, type: data.type}) 
  }
  getMessage() : Observable<any>{
    return new Observable<any>(observer =>{
      this.socket.on('new_message', (data: any)=>{
        observer.next(data);
      })
      return ()=>{
        this.socket.disconnect();
      }
    })
  }
  getAllPreMsgList(userId: any){
    return this.http.post<Array<MessagesList>>(`${env.socket_url}get_conversation_list`,{
      sender: userId
    }).pipe(tap(()=>{
      this._refresh.next();
    }))
  }
  getAllMessages(receiver: any, sender: any){
    return this.http.post<Array<Messages>>(`${env.socket_url}get_messages`,{
      receiver: receiver,
      sender: sender
    },this.httpOptions).pipe(tap(()=>{
      this._refresh.next();
    }))
  }
  sendImageRequest(body: any){
    return this.http.post<ResponseSuccess>(`${env.api_url}/chat/upload-image`,
      body
    ,this.httpOptions).pipe(tap(()=>{
      this._refresh.next();
    }))
  }
  getAllSupportMsg(){
    return this.http.get<Support>(`${env.api_url}/support/get-messages`,
    this.httpOptions).pipe(tap(()=>{
      this._refresh.next();
    }))
  }
  sendMsgSuport(body: any){
    return this.http.post<ResponseSuccess>(`${env.api_url}/support/send-message`,
    body,this.httpOptions).pipe(tap(()=>{
      this._refresh.next();
    }))
  }
}
