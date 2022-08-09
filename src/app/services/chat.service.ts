import { Injectable } from '@angular/core';
import { environment as env } from 'src/environments/environment';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket!: Socket;
  constructor() { 
    this.socket = io(env.socket_url)
  }
  userConnected(data: any){
    console.log('hello' + data, this.socket);
  }
}
