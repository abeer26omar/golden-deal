import { Component, OnInit ,Inject} from '@angular/core';
import { MatDialogClose, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ProductsRequestService } from 'src/app/services/products-request.service';
@Component({
  selector: 'app-dialog-delete',
  templateUrl: './dialog-delete.component.html',
  styleUrls: ['./dialog-delete.component.css']
})
export class DialogDeleteComponent implements OnInit {
  id!: number;
  load: boolean = false;
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
      next:res=>{
        console.log(res);
      },
      error: err=>{
        console.log(err);
      }
    })
   
  }
  ngOnDestory() :void{
    if(this.delSub){
      this.delSub.unsubscribe();
    }
  }
}
