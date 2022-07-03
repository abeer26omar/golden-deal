import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { APIResponse, Products , Product} from '../products';
import { ProductsRequestService } from '../services/products-request.service';
declare var window: any;

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  searchText: any;
  public sort: string = '';
  public products: Array<Products> = [];

  loadding = false;
  error: string = '';
  formModal: any;
 
  private routeSub: Subscription = new Subscription;
  private productSub: Subscription = new Subscription;
 
  constructor(private httpService: ProductsRequestService, 
    private route: ActivatedRoute,
    private router: Router) {
     }

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe((params: Params)=>{
      if(params['products-search']){
        this.getProducts('products', params['products-search'])
      } else{
        this.getProducts('products');
      }
    });
    this.formModal = new window.bootstrap.Modal(
      document.getElementById('myModal')
    );
  }
  getProducts(sort: string, search?: string){
    this.loadding = true;
    this.productSub = this.httpService
    .getProductsList(sort,search)
    .subscribe((productsList: APIResponse<Products>)=>{
      setTimeout(() => {
        this.loadding = false;
        this.products = productsList.data;
      }, 0);
      console.log(productsList.data);
    }, (error :HttpErrorResponse) => {
      if(error.error){
        setTimeout(() => {
          this.loadding = false;
          this.error = 'An unknown Error Occurred Check your Internet Connection Or Reload Your Page';
        }, 0);
        // console.log('An unknown Error Occurred Check your Internet Connection Or Reload Your Page')
      }
    })
  }
  productDetails(id: number){
    this.router.navigate(['product-details', id])
  }
  ngOnDestory() :void{
     if(this.productSub){
       this.productSub.unsubscribe();
     }
     if(this.routeSub){
      this.routeSub.unsubscribe();
    }
   }
   openFormModal() {
    this.formModal.show();
  }
}
