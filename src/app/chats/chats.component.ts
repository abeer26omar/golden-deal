import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { MessagesList ,Messages, APIResponse7, Support} from '../models/chat.model';
import { Subscription } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ResponseSuccess } from '../models/actions.model';
import { FormControl, FormGroup } from '@angular/forms';
import { NotificationsService } from '../services/notifications.service';
import { CookieService } from 'ngx-cookie-service';
import { MatDialog } from '@angular/material/dialog';
import { SendImagesComponent } from './send-images/send-images.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css']
})
export class ChatsComponent implements OnInit, OnDestroy {
  userId = parseInt(localStorage.getItem('userId') || this.cookieService.get('userId'));
  receiverId: any;
  admin: any;
  message: string = '';
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
  // avatar_base_url: string = 'https://admin.gooldendeal.com/storage/';
  avatar_base_url: string = 'https://storage.googleapis.com/goldendeal-bucket/';
  public chatSub: Subscription = new Subscription;
  activeId: number = 0;
  @ViewChild('chatWindow') chatWindow!: ElementRef;
  @ViewChild('sideNav') sideNav!: ElementRef;
  @ViewChild('backDrop') backDrop!: ElementRef;
  @ViewChild('textArea') textArea!: ElementRef;
  toggle: boolean = false;
  opend: boolean = false;
  chatType: boolean = false;
  supportRes: string = '';
  supportData: any;
  messages: any;
  supportErr: string = '';
  isComponentVisible: boolean = false;
  formSupport = new FormGroup({
    message: new FormControl('')
  })
  get fSupport(){
    return this.formSupport.controls;
  }
  constructor(private chatService: ChatService,
    private router: Router,
    private el: ElementRef,
    private dialogRef: MatDialog,
    private notificationService: NotificationsService,
    private breakPointObserver: BreakpointObserver,
    private cookieService: CookieService) { 
  }
  ngOnInit(): void {
      this.notificationService._insideChatComponent.next(true)
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
          sender_name: ''
        }
        this.usersMsg.push(mappedData)
      })
      this.getAllPreMsgList();
      this.getAllSupportMsg();
  }
  openModelAddImg(){
    this.dialogRef.open(SendImagesComponent,{
      width: '600px',
    })
  }
  ngAfterViewInit() {
    // this.scrollToBottom();
    // this.breakPointObserver.observe(['(max-width: 992px)']).subscribe((res)=>{
    //   if(res.matches){
    //     this.sideNav.nativeElement.classList.add('hidden');
    //     this.toggle = true;
    //   }else{
    //     this.sideNav.nativeElement.classList.remove('hidden');
    //     this.toggle = false;
    //   }
    // })
  }
  toggleSideMenu(){
    this.opend != this.opend;
    this.sideNav.nativeElement.classList.toggle('hidden');
    this.sideNav.nativeElement.classList.toggle('wavy');
    this.backDrop.nativeElement.classList.toggle('active');
  }
  scrollToBottom() {
    setTimeout(() => {
      try {
        const chatContent = document.getElementById('chat-content');
        const lastMessage = chatContent!.lastElementChild as HTMLElement;
        lastMessage.scrollIntoView({ behavior: 'smooth', block: 'end' });
      } catch(err) { }
    }, 100);
  }
  getAllSupportMsg(){
    this.chatSub = this.chatService.getAllSupportMsg().subscribe({
      next: (res: Support)=>{
        this.load = false;
        this.supportData = res.data;
        this.messages = res.data.support_messages;
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
      error: ()=>{
        this.load = false;
      }
    })
  }
  sendMsg(){
    const data = {
      sender: this.userId,
      receiver: this.receiverId,
      message: this.messageTxt
    }
    if(this.messageTxt == ''){
      this.textArea.nativeElement.classList.add('inValid')
    }else{
      this.textArea.nativeElement.classList.remove('inValid')
      this.chatService.sendMessage(data);
      this.messageTxt = '';
    }
    // this.getNewMsg();
  }
  getAllPreMsgList(){
    this.loader = true;
    this.chatService.getAllPreMsgList(this.userId).subscribe({
      next: (res: Array<MessagesList>)=>{
        this.loader = false;
        this.msgUsersList = res;
        this.getChat(this.msgUsersList[0].sender === this.userId ? this.msgUsersList[0].receiver : this.msgUsersList[0].sender)                        
      }
    })
  } 
  getChat(chatId: any){
    this.isComponentVisible = false;
    this.load = true;
    this.receiverId =  chatId;
    this.chatSub = this.chatService.getAllMessages(this.userId,this.receiverId).subscribe({
      next: (res: Array<Messages>)=>{
        this.load = false;
        this.usersMsg = res;
        this.scrollToBottom();
      },
      error: ()=>{
        this.load = false;
      }
    })
  }
  toggleComponentVisibility(): void {
    this.isComponentVisible = true;
  }
  ngOnDestroy(): void {
    this.notificationService._insideChatComponent.next(false);
    if (this.chatSub) {
      this.chatSub.unsubscribe();
    }
  }
}
 