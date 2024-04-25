import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ResponseSuccess } from 'src/app/models/actions.model';
import { ActionsService } from 'src/app/services/actions.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { ProductsRequestService } from 'src/app/services/products-request.service';
import { environment as env } from 'src/environments/environment';

@Component({
  selector: 'app-pin-product',
  templateUrl: './pin-product.component.html',
  styleUrls: ['../dialog-solid/dialog-solid.component.css','./pin-product.component.css']
})
export class PinProductComponent implements OnInit {
  product!: any;
  load: boolean = false;
  sucMsg: string = '';
  failMsg: string = '';
  private pinSub: Subscription = new Subscription;

  constructor(@Inject(MAT_DIALOG_DATA) public data:any,
  public dialogRef: MatDialogRef<MatDialogClose>,
  private productService: ProductsRequestService,
  private http: HttpClient,
  private errorHandel: ErrorHandlerService,
  public actionService: ActionsService) { 
    this.product = data.product
  }

  ngOnInit(): void {
  }

  pinProduct(){
      if(this.product.pinned === 0){
        this.load = true;
        this.http.get<ResponseSuccess>(`${env.api_url}/products/set-product-as-pinned/${this.product.id}`,this.actionService.httpOptions)
      .subscribe({
        next: res=>{
          this.product.pinned = 1;
          this.load = false;
          this.sucMsg = res.data;
          setTimeout(()=>{
            this.onNoClick(1);
          },500)
        },
        error: (err: HttpErrorResponse)=>{
          this.errorHandel.openErrorModa(err)
        }
      })
      }else{
        this.load = true;
        this.http.get<ResponseSuccess>(`${env.api_url}/products/set-product-as-unpinned/${this.product.id}`,this.actionService.httpOptions)
      .subscribe({
        next: res=>{
          this.product.pinned = 0;
          this.load = false;
          this.sucMsg = res.data;
          setTimeout(()=>{
            this.onNoClick(0);
          },500)
        },
        error: (err: HttpErrorResponse)=>{
          this.errorHandel.openErrorModa(err)
        }
      })
      }
  }
  onNoClick(status: number): void {
    this.dialogRef.close({status: status});
  }
  ngOnDestroy() :void{
    if(this.pinSub){
      this.pinSub.unsubscribe();
    }
  }

}
