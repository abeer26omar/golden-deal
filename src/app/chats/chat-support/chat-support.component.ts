import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ResponseSuccess } from '../../models/actions.model';
import { Support } from '../../models/chat.model';
import { HttpErrorResponse } from '@angular/common/http';

import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat-support',
  templateUrl: './chat-support.component.html',
  styleUrls: ['./chat-support.component.css']
})
export class ChatSupportComponent implements OnInit {
  public chatSub: Subscription = new Subscription;
  chatType: boolean = false;
  supportRes: string = '';
  supportData: any;
  messages: any;
  supportErr: string = '';
  load: boolean = false;
  formSupport = new FormGroup({
    message: new FormControl('')
  })
  get fSupport(){
    return this.formSupport.controls;
  }
  constructor(private chatService: ChatService) { 
  }

  ngOnInit(): void {
    this.getAllSupportMsg();
    this.load = true;
  }
  getAllSupportMsg(){
    this.chatSub = this.chatService.getAllSupportMsg().subscribe({
      next: (res: Support)=>{
        this.load = false;
        this.supportData = res.data;
        this.messages = res.data.support_messages;
      },
      error: (err: HttpErrorResponse)=>{
        this.load = false;
        if(err.error.data){
          this.supportErr = err.error.data;
        }else{
          this.supportErr = err.statusText;
        }         
      }
    })
  }
  sendSupport(){
    this.load = true;
    const formdata = new FormData();
    formdata.append('message', this.fSupport['message'].value)
    this.chatSub = this.chatService.sendMsgSuport(formdata).subscribe({
      next: (res: ResponseSuccess)=>{
        this.load = true;
        this.supportRes = res.data;
        this.getAllSupportMsg();
        this.formSupport.reset()
      },
      error: (err: HttpErrorResponse)=>{
        this.load = false;
        if(err.error.data){
          this.supportErr = err.error.data;
        }else{
          this.supportErr = err.statusText;
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
