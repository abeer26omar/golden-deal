import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit ,Inject} from '@angular/core';
import { MatDialogClose, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ResponseSuccess } from 'src/app/models/actions.model';
import { ProductsRequestService } from 'src/app/services/products-request.service';
@Component({
  selector: 'app-dialog-delete',
  templateUrl: './dialog-delete.component.html',
  styleUrls: ['./dialog-delete.component.css']
})
export class DialogDeleteComponent implements OnInit {
  id!: number;
  load: boolean = false;
  sucMsg: string = '';
  failMsg: string = '';
  private delSub: Subscription = new Subscription;

  constructor(@Inject(MAT_DIALOG_DATA) public data:any,
  public dialogRef: MatDialogRef<MatDialogClose>,
  private productService: ProductsRequestService) { 
    this.id = data.id
    // console.log(this.id)
  }
  ngOnInit(): void {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  deleteAdd(){
    this.load = true;
    this.delSub = this.productService.deleteProduct(this.id).subscribe({
      next:(res: ResponseSuccess)=>{
        this.sucMsg = res.data;
        this.dialogRef.close();
      },
      error: (err: HttpErrorResponse)=>{
        this.load = false;
        if(err.error.data){
          this.sucMsg = err.error.data;
        }else{
          this.sucMsg = err.statusText;
        }
      }
    })
   
  }
  ngOnDestory() :void{
    if(this.delSub){
      this.delSub.unsubscribe();
    }
  }
}
