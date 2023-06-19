import { Component, OnInit,Input } from '@angular/core';
import { Notifications } from '../models/actions.model';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  @Input() notifications!: Notifications ;
  @Input() load!: boolean;
  @Input() errorNot!: string;
  constructor() { 
    }

  ngOnInit(): void {    
  }
  
}
