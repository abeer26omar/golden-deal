import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
declare var window: any;

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {
  majorModal: any;
  delModal: any;
  constructor(private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.majorModal = new window.bootstrap.Modal(
      document.getElementById('majorModal')
    );
    this.delModal = new window.bootstrap.Modal(
      document.getElementById('delModal')
    );
  }
  editAddress(){
  }
  delAddress(){
    this.openDelModal();
  }
  openMajorModal(){
    this.majorModal.show();
  }
  openDelModal(){
    this.delModal.show();
  }
  addNewAdd(){
    this.router.navigate(['/add']);
  }
}
