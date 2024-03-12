import { Component, OnInit ,Inject} from '@angular/core';
import { MatDialogClose, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-send-gallery',
  templateUrl: './send-gallery.component.html',
  styleUrls: ['../../adds/new-add/new-add.component.css','./send-gallery.component.css']
})
export class SendGalleryComponent implements OnInit {
  imgSrc: any;
  load: boolean = false;
  file!: File;
  error: string = '';
  resSuc: string = '';
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

  constructor(@Inject(MAT_DIALOG_DATA) public data:any,
  public dialogRef: MatDialogRef<MatDialogClose>) {
  }  

  onFileChange(key: number,event: any){
    let reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    this.file =<File>event.target.files[0];
    switch(key){
      case 1:
        this.onAddNewImg1 = true;
        reader.onload = ()=>{
          this.imgSrc1 = reader.result;
        }
        // this.myForm.get('product_image_1')?.patchValue(this.file,this.file.name);
        break;
      case 2:
        this.onAddNewImg2 = true;
        reader.onload = ()=>{
          this.imgSrc2 = reader.result;
        }
        // this.myForm.get('product_image_2')?.patchValue(this.file,this.file.name);
      break;
      case 3:
        this.onAddNewImg3 = true;
        reader.onload = ()=>{
          this.imgSrc3 = reader.result;
        }
        // this.myForm.get('product_image_3')?.patchValue(this.file,this.file.name);
      break;
      case 4:
        this.onAddNewImg4 = true;
        reader.onload = ()=>{
          this.imgSrc4 = reader.result;
        }
        // this.myForm.get('product_image_4')?.patchValue(this.file,this.file.name);
      break;
      case 5:
        this.onAddNewImg5 = true;
        reader.onload = ()=>{
          this.imgSrc5 = reader.result;
        }
        // this.myForm.get('product_image_5')?.patchValue(this.file,this.file.name);
      break;
      case 6:
        this.onAddNewImg6 = true;
        reader.onload = ()=>{
          this.imgSrc6 = reader.result;
        }
        // this.myForm.get('product_image_6')?.patchValue(this.file,this.file.name);
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
  ngOnInit(): void {
  }

}
