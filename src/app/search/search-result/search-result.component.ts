import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit {
  key: string = '';
  private routeSub: Subscription = new Subscription;
  constructor(private route: ActivatedRoute) { } 

  ngOnInit(): void {
    this.routeSub = this.route.queryParams.subscribe((params) => {
      this.key = params['key'];
    });
    console.log(this.key);
    
  }

}
