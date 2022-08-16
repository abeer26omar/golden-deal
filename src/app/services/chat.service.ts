import { Injectable } from '@angular/core';
import { environment as env } from 'src/environments/environment';
import { io, Socket } from 'socket.io-client';
import { Observable, Subject, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APIResponse6, APIResponse7, Messages, MessagesList, Support } from '../models/chat.model';
import { ResponseSuccess } from '../models/actions.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket!: Socket;
  httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    })
  }
  private _refresh = new Subject<void>();
  get refresh(){
    return this._refresh;
  }
  constructor(private http: HttpClient) {
    // this.socket = io(env.socket_url)
    this.socket = io()
  }
  connect(userId: number): void{
    this.socket.emit('user_connected', userId)
  }
  sendMessage(data: any){
    this.socket.emit('send_message', data)
  }
  getMessage() : Observable<any>{
    return new Observable<{sender: string, receiver: string, message: string}>(observer =>{
      this.socket.on('send_message', (data:any)=>{
        observer.next(data)
      })
      return ()=>{
        this.socket.disconnect();
      }
    })
  }
  getAllPreMsgList(){
    return this.http.get<APIResponse6<MessagesList>>(`${env.api_url}/chat/get-conversation-list`,
    this.httpOptions)
  }
  getAllMessages(receiver: any, sender: any){
    return this.http.post<APIResponse7<Messages>>(`${env.api_url}/chat/get-messages`,{
      receiver: receiver,
      sender: sender
    },this.httpOptions)
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
