import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogClose, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ResponseSuccess } from 'src/app/models/actions.model';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-send-pdf',
  templateUrl: './send-pdf.component.html',
  styleUrls: ['./send-pdf.component.css']
})
export class SendPdfComponent implements OnInit {
  imgSrc: any;
  load: boolean = false;
  file!: File;
  error: boolean = false;
  errorMsg: string = '';
  resSuc: string = '';
  receiverId: any;
  userId: any;
  pdf: any;
  onAddNewImg: boolean = false;
  public page = 5;
  selectedFile: { type: string, url: string } | any  = null;
  public pageLabel: string = '';
  public chatSub: Subscription = new Subscription;

  constructor(@Inject(MAT_DIALOG_DATA) public data:any,
  public dialogRef: MatDialogRef<MatDialogClose>,
  private chatService: ChatService) {
    this.userId = data.sender;
    this.receiverId = data.receiver;
  }  

  ngOnInit(): void {
  }
  onFileChange(event: any){
    let reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    this.file =<File>event.target.files[0];
    // 
    const fileFormat = this.file.type.split('/')[1];
    if (fileFormat !== 'pdf' && fileFormat !== 'msword') {
      this.error = true;
      this.errorMsg = 'Supported Formats Only PDF/DOC';
      return;
    }else{
      this.error = false;
      this.errorMsg = '';
    }
    this.selectedFile = {
      type: fileFormat,
      url: URL.createObjectURL(this.file)
    };
    reader.onload = () => {
      this.pdf = reader.result as string;
    }
  }
  sendMsg(type: number, img: string){
    const data = {
      sender: this.userId,
      receiver: this.receiverId,
      message: img,
      type: type
    }
      this.chatService.sendMessage(data);
  }
  saveImagStorage(){
    const formData = new FormData();
    formData.append('file', this.file);
    this.chatSub = this.chatService.sendImageRequest(formData).subscribe({
      next: (res: ResponseSuccess)=>{
        this.sendMsg(2, res.data);
      },
      error: (err: HttpErrorResponse)=>{
        console.log(err);
      }
    })
  }
}
