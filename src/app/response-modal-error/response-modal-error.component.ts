import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogClose, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-response-modal-error',
  templateUrl: './response-modal-error.component.html',
  styleUrls: ['./response-modal-error.component.css']
})
export class ResponseModalErrorComponent implements OnInit {
  message: string = '';
  constructor(@Inject(MAT_DIALOG_DATA) public data:any,
  public dialogRef: MatDialogRef<MatDialogClose>) {   
    console.log(data.response);
    
    if(data.response.error.errors){
      Object.values(data.response.error.errors).forEach((e: any)=>{
        this.message = e
      });
    }else if(data.response.error){
      this.message = data.response.error.data
    }else{
      this.message = data.response.message
    }
    if(data.response.statusText == "Unknown Error"){
      this.message = data.response.statusText
    }    
    
   }
  close(){
    this.dialogRef.afterOpened().subscribe(_ => {
     setTimeout(() => {
        this.dialogRef.close();
     },2000)
   })
  }
  ngOnInit(): void {
    this.close()
  }

}
