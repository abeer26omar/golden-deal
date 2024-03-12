import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-send-pdf',
  templateUrl: './send-pdf.component.html',
  styleUrls: ['./send-pdf.component.css']
})
export class SendPdfComponent implements OnInit {
  imgSrc: any;
  load: boolean = false;
  file!: File;
  error: string = '';
  resSuc: string = '';
  onAddNewImg: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }
  onFileChange(event: any){
    let reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    this.file =<File>event.target.files[0];
    this.onAddNewImg = true;
    reader.onload = ()=>{
      this.imgSrc = reader.result;
    }
        // this.myForm.get('product_image_1')?.patchValue(this.file,this.file.name);

  }
  resetImg(){
    this.onAddNewImg = false;
    this.imgSrc = ''  
      // this.myForm.get('product_image_1')?.setValue('');      
  }

}
