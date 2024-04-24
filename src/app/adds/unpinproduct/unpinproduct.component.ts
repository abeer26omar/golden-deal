import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ResponseSuccess } from 'src/app/models/actions.model';
import { ProductsRequestService } from 'src/app/services/products-request.service';

@Component({
  selector: 'app-unpinproduct',
  templateUrl: './unpinproduct.component.html',
  styleUrls: ['./unpinproduct.component.css']
})
export class UnpinproductComponent implements OnInit {
  id!: number;
  load: boolean = false;
  sucMsg: string = '';
  failMsg: string = '';
  private unPinSub: Subscription = new Subscription;

  constructor(@Inject(MAT_DIALOG_DATA) public data:any,
  public dialogRef: MatDialogRef<MatDialogClose>,
  private productService: ProductsRequestService) { 
    this.id = data.id
  }

  ngOnInit(): void {
  }
  setUnPin() {
    this.load = true;
    this.unPinSub = this.productService.setAsPin(this.id).subscribe({
      next:(res:ResponseSuccess)=>{
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
  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnDestroy() :void{
    if(this.unPinSub){
      this.unPinSub.unsubscribe();
    }
  }

}
