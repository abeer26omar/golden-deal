import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ResponseSuccess } from 'src/app/models/actions.model';
import { ProductsRequestService } from 'src/app/services/products-request.service';

@Component({
  selector: 'app-pin-product',
  templateUrl: './pin-product.component.html',
  styleUrls: ['../dialog-solid/dialog-solid.component.css','./pin-product.component.css']
})
export class PinProductComponent implements OnInit {
  id!: number;
  load: boolean = false;
  sucMsg: string = '';
  failMsg: string = '';
  private pinSub: Subscription = new Subscription;

  constructor(@Inject(MAT_DIALOG_DATA) public data:any,
  public dialogRef: MatDialogRef<MatDialogClose>,
  private productService: ProductsRequestService) { 
    this.id = data.id
  }

  ngOnInit(): void {
  }
  setAsPin() {
    this.load = true;
    this.pinSub = this.productService.setAsPin(this.id).subscribe({
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
    if(this.pinSub){
      this.pinSub.unsubscribe();
    }
  }

}
