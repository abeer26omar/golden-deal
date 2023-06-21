import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgwWowService } from 'ngx-wow';
import { ActionsService } from '../services/actions.service';
import { ErrorHandlerService } from '../services/error-handler.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  constructor(private wowService: NgwWowService) { 
      this.wowService.init(); 
  }
  ngOnInit(): void {
  }
  ngOnDestroy(): void {
  }
}
