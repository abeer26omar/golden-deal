import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ChatService } from '../services/chat.service';
import { APIResponse6, MessagesList ,Messages, APIResponse7} from '../models/chat.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css']
})
export class ChatsComponent implements OnInit {
  userId = localStorage.getItem('userId');
  receiverId: any;
  message: string = '';
  messageArr: {user: string, msg: string}[] = []
  currUser: any;
  messageTxt: string = '';
  errorTxt: string = '';
  errorlist: string = '';
  senderMsg: any = [];
  recieverMsg: any = [];
  load: boolean = false;
  loader: boolean = false;

  public msgUsersList: Array<MessagesList> = []
  public usersMsg: Array<Messages> = []

  public chatSub: Subscription = new Subscription;
  constructor(private chatService: ChatService) { 
    
  }
  ngOnInit(): void {
    this.getAllPreMsgList()
  }
  sendMsg(){
    const data = {
      sender: this.userId,
      receiver: this.receiverId,
      message: this.messageTxt
    }
    this.chatService.sendMessage(data);
    this.messageTxt = '';
    this.getNewMsg();
  }
  getNewMsg(){
    const data = {
      sender: this.userId,
      receiver: this.receiverId,
      message: this.messageTxt
    }
    this.chatService.getMessage().subscribe((data)=>{
      this.usersMsg.push(data)
    })
    this.getChat(data.sender,data.receiver)
  }
  getAllPreMsgList(){
    this.loader = true;
    this.chatService.getAllPreMsgList().subscribe({
      next: (res: APIResponse6<MessagesList>)=>{
        this.loader = false;
        this.msgUsersList = res.data;        
      },
      error: (err: HttpErrorResponse)=>{
        this.loader = false;
        if(err.error.data){
          this.errorlist = err.error.data;
        }else{
          this.errorlist = err.statusText;
        }        
      }
    })
  } 
  getChat(senderId: any, receiverId: any){
    this.load = true;
    this.receiverId = receiverId;    
    this.chatSub = this.chatService.getAllMessages(senderId,receiverId).subscribe({
      next: (res: APIResponse7<Messages>)=>{
        this.load = false;
        this.usersMsg = res.data 
      },
      error: err=>{
        this.load = false;
          if(err.error.data){
            this.errorTxt = err.error.data;
          }else{
            this.errorTxt = err.statusText;
          }        
      }
    })
  }
  ngOnDestory() :void{
    if(this.chatSub){
      this.chatSub.unsubscribe();
    }
  } 
}
 