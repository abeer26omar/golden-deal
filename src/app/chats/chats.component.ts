import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { MessagesList ,Messages, APIResponse7, Support} from '../models/chat.model';
import { Subscription } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ResponseSuccess } from '../models/actions.model';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css']
})
export class ChatsComponent implements OnInit {
  userId = parseInt(localStorage.getItem('userId') || '') ;
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
  avatar_base_url: string = 'https://admin.gooldendeal.com/storage/'
  public chatSub: Subscription = new Subscription;
  @ViewChild('chatWindow') chatWindow!: ElementRef;
  @ViewChild('sideNav') sideNav!: ElementRef;
  @ViewChild('backDrop') backDrop!: ElementRef;
  toggle: boolean = false;
  opend: boolean = false;
  chatType: boolean = false;
  supportRes: string = '';
  supportData: any;
  messages: any;
  supportErr: string = '';
  formSupport = new FormGroup({
    message: new FormControl('')
  })
  get fSupport(){
    return this.formSupport.controls;
  }
  constructor(private chatService: ChatService,
    private cdr: ChangeDetectorRef,
    private el: ElementRef,
    private breakPointObserver: BreakpointObserver) { 
    }
  ngOnInit(): void {
      this.getAllPreMsgList();
      this.getAllSupportMsg();
      this.getNewMsg();
  }
  ngAfterViewInit() {
    this.scrollToBottom();
    this.breakPointObserver.observe(['(max-width: 992px)']).subscribe((res)=>{
      if(res.matches){
        this.sideNav.nativeElement.classList.add('hidden');
        this.toggle = true;
      }else{
        this.sideNav.nativeElement.classList.remove('hidden');
        this.toggle = false;
      }
    })
  }
  toggleSideMenu(){
    this.opend != this.opend;
    this.sideNav.nativeElement.classList.toggle('hidden');
    this.sideNav.nativeElement.classList.toggle('wavy');
    this.backDrop.nativeElement.classList.toggle('active');
  }
  scrollToBottom() {
    try {
      const chatContent = document.getElementById('chat-content');
      chatContent!.scrollTop = chatContent!.scrollHeight;
    } catch(err) { }
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
    this.chatService.sendMessage(data);
    this.messageTxt = '';
    this.getNewMsg();
  }
  getNewMsg(){
    this.chatService.getMessage().subscribe((data)=>{
      this.usersMsg.push(data)
      this.cdr.detectChanges();
    })
    this.getChat(this.receiverId)
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
  ngOnDestory() :void{
    if(this.chatSub){
      this.chatSub.unsubscribe();
    }
  } 
}
 