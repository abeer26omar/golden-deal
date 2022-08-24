import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AddressesService } from '../services/addresses.service';
import { Addresses, APIResponse } from '../models/user.model';
import { MatDialog } from '@angular/material/dialog';
import { DialogMajorComponent } from './dialog-major/dialog-major.component';
import { DialogDeleteComponent } from './dialog-delete/dialog-delete.component';
import { HttpErrorResponse } from '@angular/common/http';
import { MacPrefixService } from '../services/mac-prefix.service';
declare var window: any;

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {
  faildAddress: any;
  error: string = '';
  public adds: Array<Addresses> = [];
  private addSub: Subscription = new Subscription;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private addService: AddressesService,
    private dialogRef: MatDialog,
    private macService: MacPrefixService) { 
      this.addService.refresh.subscribe(()=>{
        this.getAdds();
      })
    }

  ngOnInit(): void {
      this.getAdds();
      this.faildAddress = new window.bootstrap.Modal(
        document.getElementById('faildAddress'),{backdrop: this.macService.backdrop}
      );
  }
  getAdds(){
    this.addSub = this.addService.getAllAddresses()
    .subscribe({
      next: (addsList: APIResponse<Addresses>)=>{
        this.adds = addsList.data;
      },
      error: (err: HttpErrorResponse)=>{
        if(err.error.data){
          this.error = err.error.data;
        }else{
          this.error = err.statusText;
        }
        this.faildAddress.show();
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
