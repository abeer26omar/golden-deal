import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css']
})
export class ChatsComponent implements OnInit {
  userId = localStorage.getItem('userId');
  message: string = '';
  messageArr: {user: string, msg: string}[] = []
  currUser: any
  
  constructor(private chatService: ChatService) { 
  }
  ngOnInit(): void {
    this.connect();
    this.getAllPreMsgList()
  }
  connect(){
    this.chatService.connect(this.userId)
  }
  getAllPreMsgList(){
    this.chatService.getAllPreMsgList(this.userId).subscribe({
      next: res=>{
        console.log(res);
        
      },
      error: err=>{
        console.log(err);
        
      }
    })
  }
  
}
