import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HomeAddsService } from '../services/home-adds.service';
import { APIResponse4, Pages } from '../models/user.model';

@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.css']
})
export class TermsConditionsComponent implements OnInit {
  private pageSub: Subscription = new Subscription;
  private routeSub: Subscription = new Subscription;
  public pages: Array<Pages> = [];
  pageSlug: string = '';
  title: string = '';
  desc: string = '';
  constructor(private homeAddService: HomeAddsService,
    private route: ActivatedRoute,
    private router: Router) { 
      this.homeAddService.refresh.subscribe((res)=>{
        this.getPages(this.pageSlug)
      })
    }

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe((params: Params) => {
    this.pageSlug = params['slug'];
    });
    
    this.getPages(this.pageSlug)
  }
  getPages(slug: string){
   this.pageSub = this.homeAddService.getStaticPages().subscribe({
      next: (respages: APIResponse4<Pages>)=>{
        this.pages = respages.data
        // console.log(this.pages)
        this.pages.forEach((e)=>{
          if(e.slug == slug){
            this.title = e.title;
            this.desc = e.desc;
          }
        })
      }
    })
  }
  ngOnDestory() :void{
    if(this.pageSub){
     this.pageSub.unsubscribe();
    }
   }
}

