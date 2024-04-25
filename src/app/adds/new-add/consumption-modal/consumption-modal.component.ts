import { Component, OnInit } from '@angular/core';
import { MatDialogClose, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-consumption-modal',
  templateUrl: './consumption-modal.component.html',
  styleUrls: ['../../../auth-remainder-modal/auth-remainder-modal.component.css','./consumption-modal.component.css']
})
export class ConsumptionModalComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<MatDialogClose>) { }

  ngOnInit(): void {
  }
  getAccount(){
    this.dialogRef.close();
  }
}
