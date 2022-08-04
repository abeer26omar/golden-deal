import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit,Inject } from '@angular/core';
import { MatDialogClose, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ResponseSuccess } from 'src/app/models/actions.model';
import { AddressesService } from 'src/app/services/addresses.service';

@Component({
  selector: 'app-dialog-delete',
  templateUrl: './dialog-delete.component.html',
  styleUrls: ['./dialog-delete.component.css']
})
export class DialogDeleteComponent implements OnInit {
  id!: number;
  load: boolean = false;
  sucMsg: string = '';
  failMsg: string= '';
  private addSub: Subscription = new Subscription;

  constructor(@Inject(MAT_DIALOG_DATA) public data:any,
  public dialogRef: MatDialogRef<MatDialogClose>,
  private addService: AddressesService) { 
    this.id = data.id
  }
  ngOnInit(): void {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  deleteAdd(){
    this.load = true
    this.addSub = this.addService.deleteAdd(this.id).subscribe({
      next: (res: ResponseSuccess)=>{
        this.load = false;
        this.sucMsg = res.data;
      },
      error: (err: HttpErrorResponse)=>{
        this.load = false;
        if(err.error.data){
          this.failMsg = err.error.data;
        }else{
          this.failMsg = err.statusText;
        }
      }
    })
  }
  ngOnDestory() :void{
    if(this.addSub){
      this.addSub.unsubscribe();
    }
  }
}
