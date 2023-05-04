import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css']
})
export class DepositComponent implements OnInit {
  deposit: any;
  constructor() { }

  ngOnInit(): void {
    this.depositFrom.reset()
  }
  calcDeposit(event: any){
    if(event.target.value !== ''){
      this.deposit = (1/100 * event.target.value)
    }else{
      this.deposit = '';
    }
  }
  depositFrom = new FormGroup({
    fullValue: new FormControl(''),
    depositValue: new FormControl('')
  })

}
