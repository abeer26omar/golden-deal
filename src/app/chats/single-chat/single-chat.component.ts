import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { APIResponse7, Messages } from 'src/app/models/chat.model';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-single-chat',
  templateUrl: './single-chat.component.html',
  styleUrls: ['../chat-support/chat-support.component.css','./single-chat.component.css']
})
export class SingleChatComponent implements OnInit {
  userInfo: any;
  load: boolean = false;
  userId = parseInt(localStorage.getItem('userId') || '') ;
  receiverId: any;
  admin: any;
  message: string = '';
  messageTxt: string = '';
  public usersMsg: Array<Messages> = []
  avatar_base_url: string = 'https://focused-merkle.185-92-223-5.plesk.page/golden-deal/public/storage/'
  public chatSub: Subscription = new Subscription;
  errorTxt: string = '';
  formChat = new FormGroup({
    message: new FormControl('')
  })
  get fSupport(){
    return this.formChat.controls;
  }
  constructor(private chatService: ChatService) { }
  
  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem('userInfoDeal') || '') ;
    console.log(this.userInfo);
    
  }
  getText(value: any){
    this.messageTxt = value.target.value
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
  getChat(reciever: any){
    this.load = true;
    // this.receiverId = this.admin.id; 
    this.receiverId =  reciever;
    this.chatSub = this.chatService.getAllMessages(this.userId,this.receiverId).subscribe({
      next: (res: APIResponse7<Messages>)=>{
        this.load = false;
        this.usersMsg = res.data;         
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
