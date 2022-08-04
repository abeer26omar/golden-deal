import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogClose, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AddressesService } from 'src/app/services/addresses.service';
import { ProductsRequestService } from 'src/app/services/products-request.service';
@Component({
  selector: 'app-dialog-solid',
  templateUrl: './dialog-solid.component.html',
  styleUrls: ['./dialog-solid.component.css']
})
export class DialogSolidComponent implements OnInit {
  id!: number;
  load: boolean = false;
  sucMsg: string = '';
  failMsg: string = '';
  private solidSub: Subscription = new Subscription;

  constructor(@Inject(MAT_DIALOG_DATA) public data:any,
  public dialogRef: MatDialogRef<MatDialogClose>,
  private productService: ProductsRequestService) { 
    this.id = data.id
  }
  ngOnInit(): void {
  }
  setAsSolid(){
    this.load = true;
    this.solidSub = this.productService.setAsSolid(this.id).subscribe({
      next:res=>{
        this.load = false;
        this.sucMsg = 'تم التحديد كمباع';
      },
      error:err=>{
        this.load = false;
        this.failMsg = 'حدث خطا';
      }
    })
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnDestory() :void{
    if(this.solidSub){
      this.solidSub.unsubscribe();
    }
  }
}
