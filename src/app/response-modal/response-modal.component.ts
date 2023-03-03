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
    if(data.response.error){
      this.message = data.response.error.message      
    }
  }

  ngOnInit(): void {
  }

}
