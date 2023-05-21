import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HomeAddsService } from '../services/home-adds.service';
import { APIResponse4, Pages } from '../models/user.model';
import { MacPrefixService } from '../services/mac-prefix.service';
import { ErrorHandlerService } from '../services/error-handler.service';
import { HttpErrorResponse } from '@angular/common/http';
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
    private router: Router,
    private macService: MacPrefixService,
    private errorHandel: ErrorHandlerService) { 
    }

  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.routeSub = this.route.params.subscribe((params: Params) => {
    this.pageSlug = params['slug'];
    });
    console.log(this.pageSlug);
    
    // this.getPages(this.pageSlug);
    this.faildTerms = new window.bootstrap.Modal(
      document.getElementById('faildTerms'),{backdrop: this.macService.backdrop}
    );
  }
  getPages(slug: string){
   this.pageSub = this.homeAddService.getStaticPages().subscribe({
      next: (respages: APIResponse4<Pages>)=>{
        this.pages = respages.data
        this.pages.forEach((e)=>{
          console.log(e.slug);
          if(e.slug == slug){
            this.title = e.title;
            this.desc = e.desc;
          }
        })
      },
      error: (err: HttpErrorResponse)=>{
        this.errorHandel.openErrorModa(err);
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
 
