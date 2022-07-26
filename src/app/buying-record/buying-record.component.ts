import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProfileService } from '../services/profile.service';
import { APIResponse2, Purchases } from '../user.model';

@Component({
  selector: 'app-buying-record',
  templateUrl: './buying-record.component.html',
  styleUrls: ['./buying-record.component.css']
})
export class BuyingRecordComponent implements OnInit {
  private recordSub: Subscription = new Subscription;
  public records: Array<Purchases> = [];

  constructor(private profileService: ProfileService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.getAllPurchases()
  }
  getAllPurchases(){
    this.recordSub = this.profileService.buyingRecord().subscribe({
      next: (resData: APIResponse2<Purchases>)=>{
        this.records = resData.data;
        // console.log(resData)
      },
      error: err=>{
        console.log(err)
      }
    })
  }

}
