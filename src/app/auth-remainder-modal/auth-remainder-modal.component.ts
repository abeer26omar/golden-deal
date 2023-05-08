import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogClose, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-auth-remainder-modal',
  templateUrl: './auth-remainder-modal.component.html',
  styleUrls: ['./auth-remainder-modal.component.css']
})
export class AuthRemainderModalComponent implements OnInit {

  constructor(private route: Router,
    public dialogRef: MatDialogRef<MatDialogClose>) { }
  getAccount(){
    this.dialogRef.close();
    this.route.navigate(['/register']);
  }
  ngOnInit(): void {
  }

}
