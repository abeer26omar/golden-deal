import { Component, OnInit,Inject } from '@angular/core';
import { MatDialogClose, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AddressesService } from 'src/app/services/addresses.service';

@Component({
  selector: 'app-dialog-delete',
  templateUrl: './dialog-delete.component.html',
  styleUrls: ['./dialog-delete.component.css']
})
export class DialogDeleteComponent implements OnInit {
  id!: number;
  load: boolean = false;
  private addSub: Subscription = new Subscription;

  constructor(@Inject(MAT_DIALOG_DATA) public data:any,
  public dialogRef: MatDialogRef<MatDialogClose>,
  private addService: AddressesService) { 
    this.id = data.id
    // console.log(this.id)
  }
  ngOnInit(): void {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  deleteAdd(){
    this.load = true
    this.addSub = this.addService.deleteAdd(this.id).subscribe({
      next: res=>{
      this.load = false;
      this.dialogRef.close();
      },
      error: err=>{
      this.load = false;
      this.dialogRef.close();
      }
    })
  }
  ngOnDestory() :void{
    if(this.addSub){
      this.addSub.unsubscribe();
    }
  }
}
