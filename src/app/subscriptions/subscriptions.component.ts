import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { APIresponse, Subscriptions } from '../models/actions.model';
import { ActionsService } from '../services/actions.service';
import { MacPrefixService } from '../services/mac-prefix.service';
import { PaymentDetailsDialogComponent } from './payment-details-dialog/payment-details-dialog.component';
declare var window: any;

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.css']
})
export class SubscriptionsComponent implements OnInit {
  paymentModal: any;
  reviewModal: any;
  faildSubscribtion: any;
  errMsg: string = '';
  public subscriptions: Array<Subscriptions> = [];
  private subscriptionSub: Subscription = new Subscription;
  subscribtionForm = new FormGroup({
    subscribe: new FormControl('', [Validators.required]),
  });
  payForm = new FormGroup({
    chosePay : new FormControl('',[Validators.required])
  });
  constructor(private actionService: ActionsService,
    private macService: MacPrefixService,
    private dialogRef: MatDialog) { }
  get f(){
    return this.subscribtionForm.controls;
  }
  get fPay(){
    return this.payForm.controls;
  }
  ngOnInit(): void {
    this.paymentModal = new window.bootstrap.Modal(
      document.getElementById('payment'),{backdrop: this.macService.backdrop}
    );
    this.reviewModal = new window.bootstrap.Modal(
      document.getElementById('review'),{backdrop: this.macService.backdrop}
    );
    this.faildSubscribtion = new window.bootstrap.Modal(
      document.getElementById('faildSubscribtion'),{backdrop: this.macService.backdrop}
    );
    this.getSubscriptionTypes()
  }
  getSubscriptionTypes(){
    this.subscriptionSub = this.actionService.getSubscribtionsType().subscribe({
      next: (resData: APIresponse<Subscriptions>)=>{
        this.subscriptions = resData.data;
      }
    })
  }
  choose(sub_id: number){
        // this.openFormModal();
    this.dialogRef.open(PaymentDetailsDialogComponent,{
      data: {
        subscription_method: sub_id
      }
    })
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
  ngOnDestory() :void{
    if(this.subscriptionSub){
      this.subscriptionSub.unsubscribe();
    }
  }
}
