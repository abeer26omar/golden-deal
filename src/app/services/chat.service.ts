import { Injectable } from '@angular/core';
import { environment as env } from 'src/environments/environment';
import { io, Socket } from 'socket.io-client';
import { Observable, Subject, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APIResponse6, MessagesList, Support } from '../models/chat.model';
import { ResponseSuccess } from '../models/actions.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: Socket;
  httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Access-Control-Allow-Origin': '*'
    })
  }
  private _refresh = new Subject<void>();
  get refresh(){
    return this._refresh;
  }
  constructor(private http: HttpClient) { 
    this.socket = io(env.socket_url)
  }
  connect(data: any): void{
    this.socket.emit('user_connected', data)
  }
  sendMessage(data: any): void{
    this.socket.emit('send_message', data)
  }
  getMessage() : Observable<any>{
    return new Observable<any>(observer =>{
      this.socket.on('new_message', (data)=>{
        observer.next(data)
      })
      return ()=>{
        this.socket.disconnect();
      }
    })
  }
  getAllPreMsgList(sender: any){
    return this.http.post<APIResponse6<MessagesList>>(`${env.socket_url}get_conversation_list`,{
     'sender': JSON.parse(sender)
    })
  }
  getAllSupportMsg(){
    return this.http.get<Support>(`${env.api_url}/support/get-messages`,this.httpOptions).pipe(tap(()=>{
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
