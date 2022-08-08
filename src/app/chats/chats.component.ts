import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css']
})
export class ChatsComponent implements OnInit {
  public chatSub: Subscription = new Subscription;
  chatType: boolean = false;
  constructor(private chatService: SocketService) { 
  }

  ngOnInit(): void {
  }
  sendSupport(){
    const formdata = new FormData();
    this.chatSub = this.chatService.sendSupportMsg(formdata).subscribe({
    })
  }
  getAllMsg(){
    this.chatSub = this.chatService.getAllSupportMsg().subscribe({

    })
  }
  ngOnDestory() :void{
    if(this.chatSub){
      this.chatSub.unsubscribe();
    }
  }
}
