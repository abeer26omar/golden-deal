import { Component, OnInit,OnDestroy } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Adds, APIResponse3} from '../products';
import { HomeAddsService } from '../services/home-adds.service';


@Component({
  selector: 'app-img-banner',
  templateUrl: './img-banner.component.html',
  styleUrls: ['./img-banner.component.css']
})
export class ImgBannerComponent implements OnInit , OnDestroy{
  public adds : Array<Adds> = [];
  private addSub: Subscription = new Subscription;

  constructor(config: NgbCarouselConfig,
    private httpService: HomeAddsService, 
    private route: ActivatedRoute,
    private router: Router) {
    config.interval = 5000;
    config.keyboard = true;
    config.pauseOnHover = true;
    config.animation = true;
   }
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    this.getAdds();
  }
  getAdds(){
    this.addSub = this.httpService.getAdds().subscribe((addList: APIResponse3<Adds>)=>{
      this.adds = addList.data;
      console.log(this.adds);
    })
  }
  ngOnDestory() :void{
    if(this.addSub){
      this.addSub.unsubscribe();
    }
  }
}
