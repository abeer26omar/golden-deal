import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare var window: any;

@Component({
  selector: 'app-adds',
  templateUrl: './adds.component.html',
  styleUrls: ['./adds.component.css']
})
export class AddsComponent implements OnInit {
  filterModal: any;
  deleteModal: any;
  solidModal: any;
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.filterModal = new window.bootstrap.Modal(
      document.getElementById('myModalFilter')
    );
    this.deleteModal = new window.bootstrap.Modal(
      document.getElementById('myModalDelete')
    );
    this.solidModal = new window.bootstrap.Modal(
      document.getElementById('myModalSolid')
    );
  }
  openFilterModal(){
    this.filterModal.show();
  }
  openDeleteModal(){
    this.deleteModal.show();
  }
  openSolidModal(){
    this.solidModal.show();
  }
  addNewAdd(){
    this.router.navigate(['new-add'])
  }
}
