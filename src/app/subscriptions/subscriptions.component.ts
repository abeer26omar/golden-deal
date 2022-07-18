import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
declare var window: any;

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.css']
})
export class SubscriptionsComponent implements OnInit {
  paymentModal: any;
  reviewModal: any;
  subscribtionForm = new FormGroup({
    subscribe: new FormControl('', [Validators.required]),
  });
  payForm = new FormGroup({
    chosePay : new FormControl('',[Validators.required])
  });
  constructor() { }
  get f(){
    return this.subscribtionForm.controls;
  }
  get fPay(){
    return this.payForm.controls;
  }
  ngOnInit(): void {
    this.paymentModal = new window.bootstrap.Modal(
      document.getElementById('payment')
    );
    this.reviewModal = new window.bootstrap.Modal(
      document.getElementById('review')
    );
  }
  submit(){
    console.log(this.subscribtionForm.get('subscribe')?.value)
    this.openFormModal();
  }
  submitPay(){
    console.log(this.payForm.get('chosePay')?.value)
    this.openReviewModal();
    this.paymentModal.hide()
  }
  openFormModal() {
    this.paymentModal.show();
  }
  openReviewModal(){
    this.reviewModal.show();
  }
}
