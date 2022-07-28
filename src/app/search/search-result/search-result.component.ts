import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit {
  arrayOfValues: Array<object> = [];

private routeSub: Subscription = new Subscription;
  constructor(private route: ActivatedRoute) { 
  const myArray = this.route.queryParams.subscribe((result) => {
    // console.log(result)
  })
} 

  ngOnInit(): void {
  }

}
