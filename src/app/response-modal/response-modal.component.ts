import { Component,  OnInit, Inject } from '@angular/core';
import { MatDialogClose, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-response-modal',
  templateUrl: './response-modal.component.html',
  styleUrls: ['./response-modal.component.css']
})
export class ResponseModalComponent implements OnInit {
  message: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data:any,
  public dialogRef: MatDialogRef<MatDialogClose>) {    
    if(data){
      this.message = data.response;
    }
    else if(data.response.message){
      this.message = data.response.message
    }else{
      this.message = data.response.data
    }
  }
  close(){
    this.dialogRef.afterOpened().subscribe(_ => {
     setTimeout(() => {
        this.dialogRef.close();
     },1500)
   })
  }
  ngOnInit(): void {
    this.close()
  }
}
