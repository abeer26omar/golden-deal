import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit ,Inject} from '@angular/core';
import { MatDialogClose, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ResponseSuccess } from 'src/app/models/actions.model';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-send-gallery',
  templateUrl: './send-gallery.component.html',
  styleUrls: ['../../adds/new-add/new-add.component.css','./send-gallery.component.css']
})
export class SendGalleryComponent implements OnInit {
  imgSrc: any;
  load: boolean = false;
  file!: File;
  error: boolean = false;
  errorMsg: string = '';
  resSuc: string = '';
  receiverId: any;
  userId: any;
  fileValue: any;
  imageSources: string[] = [];
  images: any = [];
  addNewFlags: boolean[] = [];
  imgSrc1: any;
  imgSrc2: any;
  imgSrc3: any;
  imgSrc4: any;
  imgSrc5: any;
  imgSrc6: any;
  onAddNewImg1: boolean = false;
  onAddNewImg2: boolean = false;
  onAddNewImg3: boolean = false;
  onAddNewImg4: boolean = false;
  onAddNewImg5: boolean = false;
  onAddNewImg6: boolean = false;
  public chatSub: Subscription = new Subscription;

  constructor(@Inject(MAT_DIALOG_DATA) public data:any,
  public dialogRef: MatDialogRef<MatDialogClose>,
  private chatService: ChatService) {
    this.userId = data.sender;
    this.receiverId = data.receiver;
  }  

  onFileChange(key: number, event: any){
    this.errorMsg = '';
    this.error = false;
    let reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    this.file = <File>event.target.files[0];
    // 
    const fileFormat = this.file.type.split('/')[1];
    if (fileFormat !== 'png' && fileFormat !== 'jpeg' && fileFormat !== 'jpg') {
      this.error = true;
      this.errorMsg = 'Supported Formats Only png/jpg/jpeg';
      return;
    }else{
      this.error = false;
      this.errorMsg = '';
    }
    this.imageSources[key - 1] = reader.result as string;
    this.addNewFlags[key - 1] = true;
    switch(key){
      case 1:
        this.onAddNewImg1 = true;
        reader.onload = ()=>{
          this.imgSrc1 = reader.result;
          const base64Image = reader.result as string;
          this.images.push(base64Image);
        }
        break;
      case 2:
        this.onAddNewImg2 = true;
        reader.onload = ()=>{
          this.imgSrc2 = reader.result;
          const base64Image = reader.result as string;
          this.images.push(base64Image);
        }
      break;
      case 3:
        this.onAddNewImg3 = true;
        reader.onload = ()=>{
          this.imgSrc3 = reader.result;
          const base64Image = reader.result as string;
          this.images.push(base64Image);
        }
      break;
      case 4:
        this.onAddNewImg4 = true;
        reader.onload = ()=>{
          this.imgSrc4 = reader.result;
          const base64Image = reader.result as string;
          this.images.push(base64Image);
        }
      break;
      case 5:
        this.onAddNewImg5 = true;
        reader.onload = ()=>{
          this.imgSrc5 = reader.result;
          const base64Image = reader.result as string;
          this.images.push(base64Image);
        }
      break;
      case 6:
        this.onAddNewImg6 = true;
        reader.onload = ()=>{
          this.imgSrc6 = reader.result;
          const base64Image = reader.result as string;
          this.images.push(base64Image);
        }
      break;
    }
  }
  resetImg(key: any){
    switch(key){
      case 1:
        this.onAddNewImg1 = false;
        this.imgSrc1 = ''  
        // this.myForm.get('product_image_1')?.setValue('');
      break;
      case 2:
        this.onAddNewImg2 = false;
        this.imgSrc2 = ''  
        // this.myForm.get('product_image_2')?.setValue('');
      break;
      case 3:
        this.onAddNewImg3 = false;
        this.imgSrc3 = ''  
        // this.myForm.get('product_image_3')?.setValue('');
      break;
      case 4:
        this.onAddNewImg4 = false;
        this.imgSrc4 = ''  
        // this.myForm.get('product_image_4')?.setValue('');
      break;
      case 5:
        this.onAddNewImg5 = false;
        this.imgSrc5 = ''  
        // this.myForm.get('product_image_5')?.setValue('');
      break;
      case 6:
        this.onAddNewImg6 = false;
        this.imgSrc6 = ''  
        // this.myForm.get('product_image_6')?.setValue('');
      break;
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
    if (this.addNewFlags.every(flag => !flag)) {
      this.error = true;
      this.errorMsg = 'يجب اضافه صوره على الاقل';
      return;
    }
    const formData = new FormData();
    formData.append('file', this.file)
    this.chatSub = this.chatService.sendImageRequest(formData).subscribe({
      next: (res: ResponseSuccess)=>{
        this.sendMsg(1, res.data);
      },
      error: (err: HttpErrorResponse)=>{
        console.log(err);
      }
    })
  }
  ngOnInit(): void {
  }

}
