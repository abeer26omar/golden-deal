import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-edit-address',
  templateUrl: './add-edit-address.component.html',
  styleUrls: ['./add-edit-address.component.css']
})
export class AddEditAddressComponent implements OnInit {
  addForm = new FormGroup({
    addKind: new FormControl('',[Validators.required]),
    add: new FormControl('',[Validators.required]),
    city: new FormControl('',[Validators.required]),
    streetNo: new FormControl('',[Validators.required]),
    buildingNo: new FormControl('',[Validators.required])
  })
  constructor() { }
  get f() { return this.addForm.controls; }

  ngOnInit(): void {
  }
  onSubmit(){
    if (this.addForm.invalid) {
      return;
    }
  }
}
