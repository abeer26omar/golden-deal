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
  sendMsg(senderId: number, receiverId: number){
    this.chatService.sendMessage(senderId, receiverId, this.messageTxt)
    this.messageTxt = '';
  }
  getNewMsg(){
    this.chatService.getMessage().subscribe(({senderId, receiverId, message})=>{
      this.usersMsg.push(senderId, receiverId, message)
    })
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
  getChat(senderId: number, receiverId: number){
    this.load = true;
    this.chatSub = this.chatService.getAllMessages(senderId,receiverId).subscribe({
      next: (res: APIResponse7<Messages>)=>{
        this.load = false;
        this.usersMsg = res.data 
        console.log(this.usersMsg);
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
 