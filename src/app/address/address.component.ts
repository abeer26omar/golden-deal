import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AddressesService } from '../services/addresses.service';
import { Addresses, APIResponse } from '../models/user.model';
import { MatDialog } from '@angular/material/dialog';
import { DialogMajorComponent } from './dialog-major/dialog-major.component';
import { DialogDeleteComponent } from './dialog-delete/dialog-delete.component';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {

  public adds: Array<Addresses> = [];
  private addSub: Subscription = new Subscription;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private addService: AddressesService,
    private dialogRef: MatDialog) { 
      this.addService.refresh.subscribe((res)=>{
        this.getAdds();
      })
    }

  ngOnInit(): void {
      this.getAdds();
  }
  getAdds(){
    this.addSub = this.addService.getAllAddresses()
    .subscribe({
      next: (addsList: APIResponse<Addresses>)=>{
        this.adds = addsList.data;
        // console.log(this.adds)
      },
      error: err=>{
        console.log(err)
      }
    })
  }
  editAddress(id: number){
    this.router.navigate([`/edit/${id}`])
  }
  openMajorDialog(id: number){
    this.dialogRef.open(DialogMajorComponent,{
      data: {
        id: id
      }
    })
  }
  openDeleteDialog(id: number){
    this.dialogRef.open(DialogDeleteComponent,{
      data: {
        id: id
      }
    })
    // this.addSub = this.addService.deleteAdd(id).subscribe({
    //   next: res=>{
    //     // console.log(res)
    //   },
    //   error: err=>{
    //     console.log(err)
    //   }
    // })
  }
  addNewAdd(){
    this.router.navigate(['/add']);
  }
  ngOnDestory() :void{
    if(this.addSub){
      this.addSub.unsubscribe();
    }
  }
}
