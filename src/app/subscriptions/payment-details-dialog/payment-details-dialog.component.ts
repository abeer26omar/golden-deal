import { Component, OnInit ,Inject} from '@angular/core';
import { FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { MatDialogClose, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-payment-details-dialog',
  templateUrl: './payment-details-dialog.component.html',
  styleUrls: ['./payment-details-dialog.component.css']
})
export class PaymentDetailsDialogComponent implements OnInit {
  error: boolean = false;
  errMsg: string = '';
  loader: boolean = false;
  payForm = new FormGroup({
    chosePay : new FormControl('',[Validators.required]),
    card_num: new FormControl('',[Validators.required,Validators.maxLength(16)]),
    owner_name: new FormControl('',[Validators.required]),
    cvc_number: new FormControl('',[Validators.required]),
  });
  get fPay(){
    return this.payForm.controls;
  }
  constructor(@Inject(MAT_DIALOG_DATA) public data:any,
  public dialogRef: MatDialogRef<MatDialogClose>,) { 
    // console.log(this.data);
  }

  submitPay(){}
  ngOnInit(): void {
  }

}
