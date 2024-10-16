import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProfileService } from '../services/profile.service';
import { APIResponse2, Purchases } from '../models/user.model';
import { ErrorHandlerService } from '../services/error-handler.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-buying-record',
  templateUrl: './buying-record.component.html',
  styleUrls: ['./buying-record.component.css']
})
export class BuyingRecordComponent implements OnInit {
  private recordSub: Subscription = new Subscription;
  public records: Array<Purchases> = [];
  error: string = '';
  loadding: boolean = false;
  mac: boolean = false;
  constructor(private profileService: ProfileService,
    private errorHandel: ErrorHandlerService) { 
    }

  ngOnInit(): void {
    this.getAllPurchases()
  }
  getAllPurchases(){
    this.loadding = true;
    this.recordSub = this.profileService.buyingRecord().subscribe({
      next: (resData: APIResponse2<Purchases>)=>{
        this.loadding = false;
        this.records = resData.data;
        if(this.records.length == 0){
          this.error = 'لا يوجد مشتريات'
        }else{
          this.error = '';
        }
      },
      error: (err: HttpErrorResponse)=>{
        this.loadding = false;
        this.errorHandel.openErrorModa(err)
      }
    })
  }
  ngOnDestroy(): void {
    if(this.recordSub){
      this.recordSub.unsubscribe();
    }
  }

}
