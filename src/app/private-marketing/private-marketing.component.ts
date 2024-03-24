import { Component, OnInit, OnDestroy } from '@angular/core';
import { PrivateMarketing } from '../models/actions.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { ActionsService } from '../services/actions.service';

@Component({
  selector: 'app-private-marketing',
  templateUrl: './private-marketing.component.html',
  styleUrls: ['./private-marketing.component.css']
})
export class PrivateMarketingComponent implements OnInit, OnDestroy {

  privatePage: PrivateMarketing = {
    data: {
      id: 0,
      title: '',
      desc: '',
      image: '',
      whatsapp: '',
      slug: ''
    }
  }
  privateSub: Subscription = new Subscription;
  constructor(private httpService: ActionsService,) { }

  ngOnInit(): void {
    this.getPrivatePage()
  }
  getPrivatePage (){
    this.privateSub = this.httpService.getPrivateMarketingPage()
      .subscribe({
        next: (res: PrivateMarketing)=>{
          this.privatePage = res   
        },
        error: (err: HttpErrorResponse)=>{
        }
      })
  }
  ngOnDestroy() :void{
    if(this.privateSub){
      this.privateSub.unsubscribe();
    }
  }
}
