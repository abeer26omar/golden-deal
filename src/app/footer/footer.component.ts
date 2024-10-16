import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(private route: Router) { }

  ngOnInit(): void {
  }
  termsCondition(slug: string){
    this.route.navigate(['/termsandconditions',slug])
  }

}
