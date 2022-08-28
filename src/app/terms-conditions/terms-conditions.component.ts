import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { HomeAddsService } from '../services/home-adds.service';
import { APIResponse4, Pages } from '../models/user.model';
import { HttpErrorResponse } from '@angular/common/http';
import { MacPrefixService } from '../services/mac-prefix.service';
declare var window: any;

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
  faildTerms: any;
  errMsg: string = '';
  constructor(private homeAddService: HomeAddsService,
    private route: ActivatedRoute,
    private macService: MacPrefixService) { 
    }

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe((params: Params) => {
    this.pageSlug = params['slug'];
    });
    this.getPages(this.pageSlug);
    this.faildTerms = new window.bootstrap.Modal(
      document.getElementById('faildTerms'),{backdrop: this.macService.backdrop}
    );
  }
  getPages(slug: string){
   this.pageSub = this.homeAddService.getStaticPages().subscribe({
      next: (respages: APIResponse4<Pages>)=>{
        this.pages = respages.data
        console.log(respages);
        
        this.pages.forEach((e)=>{
          if(e.slug == slug){
            this.title = e.title;
            this.desc = e.desc;
          }
        })
      },
      error:(err: HttpErrorResponse)=>{
        this.faildTerms.show();
        this.errMsg = err.error.data;
        if(err.error.data){
          this.errMsg = err.error.data;
        }else{
          this.errMsg = err.statusText;
        }
      }
    })
  }
  ngOnDestory() :void{
    if(this.pageSub){
     this.pageSub.unsubscribe();
    }
    if(this.routeSub){
      this.routeSub.unsubscribe();
     }
  }
}
 
