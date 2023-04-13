import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ChatService } from '../services/chat.service';
import { MessagesList ,Messages, APIResponse7} from '../models/chat.model';
import { Subscription } from 'rxjs';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css']
})
export class ChatsComponent implements OnInit {
  userId = localStorage.getItem('userId');
  receiverId: any;
  admin: any;
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
  constructor(private chatService: ChatService,
    private adminService: AdminService) { 
    
  }
  ngOnInit(): void {
    // this.admin = this.adminService.getOption();
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
    this.getChat(data.receiver)
  }
  getAllPreMsgList(){
    this.loader = true;
    this.chatService.getAllPreMsgList(this.userId).subscribe({
      next: (res: Array<MessagesList>)=>{
        this.loader = false;
        this.msgUsersList = res;
      }
    })
  } 
  getChat(reciever: any){
    this.load = true;
    // this.receiverId = this.admin.id; 
    this.receiverId =  reciever;
    this.chatSub = this.chatService.getAllMessages(this.userId,this.receiverId).subscribe({
      next: (res: APIResponse7<Messages>)=>{
        this.load = false;
        this.usersMsg = res.data 
      },
      error: ()=>{
        this.load = false;
      }
    })
  }
  ngOnDestory() :void{
    if(this.chatSub){
      this.chatSub.unsubscribe();
    }
  } 
}
 