import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment as env } from 'src/environments/environment';
import { io } from "socket.io-client";


@Injectable({
  providedIn: 'root'
})
export class SocketService {
  public message$: BehaviorSubject<string> = new BehaviorSubject('');

  constructor() { }
  socket = io(env.socket_url,{
    withCredentials: true,
    extraHeaders: {
      "Access-Control-Allow-Origin": "*", 
      'Access-Control-Allow-Credentials': 'true' ,
      "Access-Control-Allow-Methods" : 'OPTIONS, GET, POST',
      "Access-Control-Allow-Headers": "Content-Type, Depth, User-Agent, X-File-Size, X-Requested-With, If-Modified-Since, X-File-Name, Cache-Control"   
    }
  });

  // connected(data :any): void{
  //   this.socket.emit('user_connected' , data)
  // }
  // sendMsg(data :any): void{
  //   this.socket.emit('send_message' , data)
  // }
  // getMsg(): Observable<any>{
  //   return new Observable<{user: string, message: string}>((observer:any) =>{
  //     this.socket.on('new_message', (data:any)=>{
  //       observer.next(data);
  //     })
  //     return ()=>{
  //       this.socket.disconnect()
  //     }
  //   })
  // }
  
  public sendMessage(message: any) {
    this.socket.emit('send_message', message);
  }

  public getNewMessage = () => {
    this.socket.on('new_message', (message) =>{
      this.message$.next(message);
    });
    
    return this.message$.asObservable();
  };
}
