import { Component, OnDestroy, OnInit} from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { Adds, APIResponse3} from '../models/products.model';
import { HomeAddsService } from '../services/home-adds.service';


@Component({
  selector: 'app-adds-banner',
  templateUrl: './adds-banner.component.html',
  styleUrls: ['./adds-banner.component.css']
})
export class AddsBannerComponent implements OnInit , OnDestroy{
  public adds : Array<Adds> = [];
  private addSub: Subscription = new Subscription;
  error: string = '' ;
  constructor(config: NgbCarouselConfig,
    private httpService: HomeAddsService) {
    config.interval = 5000;
    config.keyboard = true;
    config.pauseOnHover = true;
    config.animation = true;
   }
  ngOnInit(): void {
    this.getAdds();
  }
  getAdds(){
    this.addSub = this.httpService.getAdds()
    .subscribe({
      next:(addList: APIResponse3<Adds>)=>{
        this.adds = addList.data;
      }
    })
  }
  ngOnDestroy(): void {
    if(this.addSub){
      this.addSub.unsubscribe();
    }
  }
}
