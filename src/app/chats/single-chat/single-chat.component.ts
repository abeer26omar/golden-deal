import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Messages } from 'src/app/models/chat.model';
import { ChatService } from 'src/app/services/chat.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { CookieService } from 'ngx-cookie-service';
import { MatDialog } from '@angular/material/dialog';
import { CameraMediaComponent } from '../camera-media/camera-media.component';
import { SendGalleryComponent } from '../send-gallery/send-gallery.component';
import { SendPdfComponent } from '../send-pdf/send-pdf.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-single-chat',
  templateUrl: './single-chat.component.html',
  styleUrls: ['../chats.component.css']
})
export class SingleChatComponent implements OnInit, OnDestroy {
  userInfo: any;
  load: boolean = false;
  userId = parseInt(localStorage.getItem('userId') || this.cookieService.get('userId'));
  receiverId: any;
  admin: any;
  message: string = '';
  messageTxt: string = '';
  public usersMsg: Array<Messages> = [];
  avatar_base_url: string = 'https://storage.googleapis.com/goldendeal-bucket/';
  @ViewChild('textArea') textArea!: ElementRef;
  public chatSub: Subscription = new Subscription;
  errorTxt: string = '';
  formChat = new FormGroup({
    message: new FormControl('')
  })
  get fSupport(){
    return this.formChat.controls;
  }
  constructor(private chatService: ChatService,
    private notificationService: NotificationsService,
    private cookieService: CookieService,
    private dialogRef: MatDialog,
    private router: Router) { }
  
  ngOnInit(): void {
    this.notificationService._insideChatComponent.next(false);
    this.userInfo = JSON.parse(localStorage.getItem('userInfoDeal') || this.cookieService.get('userInfoDeal'));
    this.chatService.connect(this.userId)
      this.chatSub = this.chatService.getMessage().subscribe((data)=>{
        const mappedData = {
          message: data.message,
          receiver_avatar: '',
          receiver_id: data.receiver,
          receiver_name: '',
          seen_at: 0,
          sender_avatar: '',
          sender_id: data.sender,
          sender_name: '',
          type: 0
        }
        this.usersMsg.push(mappedData)        
      })
    this.getChat(this.userInfo.owner.id);
  }
  sendMsg(type: number, msg?: string){
    const data = {
      sender: this.userId,
      receiver: this.receiverId,
      message: this.messageTxt || msg,
      type: type
    }
    if(this.messageTxt == ''){
      this.textArea.nativeElement.classList.add('inValid')
    }else{
      this.textArea.nativeElement.classList.remove('inValid')
      this.chatService.sendMessage(data);
      this.messageTxt = '';
    }
  }
  parsing(msg: any) {
    const message = JSON.parse(msg);
    const imageUrl = message.default_image;
    const name = message.name;
    const orderCode = message.order_code;
//  href="https://gooldendeal.com/product-details/${msg.id}" target="_blank"
  return `<img src="${imageUrl}" width='200px' height='150px'/>
    <p class='mt-2'>اسم المنتج: ${name}</p>
    <p class='mb-0'>رقم الطلب: ${orderCode}</p>`;
  }
  
  openCameraDialog(){
    this.dialogRef.open(CameraMediaComponent,{
      width: '600px',
      data: {
        sender: this.userId,
        receiver: this.receiverId,
      }
    })
  }
  openGalleryDialog(){
    this.dialogRef.open(SendGalleryComponent,{
      width: '500px',
      data: {
        sender: this.userId,
        receiver: this.receiverId,
      }
    })
  }
  openPdfDialog(){
    this.dialogRef.open(SendPdfComponent,{
      width: '500px',
      data: {
        sender: this.userId,
        receiver: this.receiverId,
      }
    })
  }
  scrollToBottom() {
    setTimeout(() => {
      try {
        const chatContent = document.getElementById('chat-content');
        const lastMessage = chatContent!.lastElementChild as HTMLElement;
        lastMessage.scrollIntoView({ behavior: 'smooth' });
      } catch(err) { }
    }, 100);
  }
  getChat(reciever: any){
    this.load = true;
    // this.receiverId = this.admin.id; 
    this.receiverId =  reciever;
    this.chatSub = this.chatService.getAllMessages(this.userId,this.receiverId).subscribe({
      next: (res: Array<Messages>)=>{
        this.load = false;
        this.usersMsg = res;
        this.scrollToBottom()                 
      },
      error: ()=>{
        this.load = false;
      }
    })
  }
  ngOnDestroy() :void{
    this.notificationService._insideChatComponent.next(false);
    if(this.chatSub){
      this.chatSub.unsubscribe();
    }
  } 
}
