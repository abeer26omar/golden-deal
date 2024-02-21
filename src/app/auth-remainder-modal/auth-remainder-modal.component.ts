import { Component, OnInit } from '@angular/core';
import { MatDialogClose, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-auth-remainder-modal',
  templateUrl: './auth-remainder-modal.component.html',
  styleUrls: ['./auth-remainder-modal.component.css']
})
export class AuthRemainderModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<MatDialogClose>) { }
  getAccount(){
    this.dialogRef.close();
  }
  ngOnInit(): void {
  }

}
