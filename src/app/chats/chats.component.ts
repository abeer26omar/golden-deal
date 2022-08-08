import { Component, OnInit } from '@angular/core';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css']
})
export class ChatsComponent implements OnInit {
  public roomId!: string;
  public messageTxt!: string;
  public mesArray : {user: string, message: string}[] = [];
  public phone!: string;
  public currentUser: any;
  public selectedUser: any;
  public userList = [
    {
      id: 0,
      name: 'ahmed',
      phone: '12345678',
      image: '../../assets/images/',
      roomid: {}
    }
  ]

  newMessage: string = '';
  messageList: string[] = [];
  constructor(private chatService: SocketService) { 
    // this.chatService.getMsg().subscribe({
    //   next: (data: {user: string, message: string})=>{
    //     this.mesArray.push(data)
    //   }
    // })
  }

  ngOnInit(): void {
    // this.currentUser = this.userList[0]
    this.chatService.getNewMessage().subscribe((message: string) => {
      this.messageList.push(message);
    })
  }
  sendMessage() {
    this.chatService.sendMessage(this.newMessage);
    this.newMessage = '';
  }
  // selectedUserHandler(phone: string): void{
  //   this.selectedUser = this.userList.find(user =>{user.phone === phone});
  //   this.roomId = this.selectedUser.roomId[this.selectedUser.id];
  //   this.mesArray = []
  //   this.join(this.currentUser.name, this.roomId)
  // }
  // join(userName: any, roomid: any){
  //   this.chatService.connected({user: userName, roomId: roomid})
  // }
  // sendMessage(){
  //   this.chatService.sendMsg({
  //     data: this.currentUser.name,
  //     room: this.roomId,
  //     message: this.messageTxt
  //   });
  //   this.messageTxt = ''
  // }
}
