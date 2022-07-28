import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { APIResponse, Products , APIResponse2, Category} from '../models/products.model';
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
  public categories : Array<Category> = [];

  loadding = false;
  error: string = '';
  formModal: any;
  errorLength = '';
  productsDefId : any;
  private routeSub: Subscription = new Subscription;
  private productSub: Subscription = new Subscription;
  private categorySub : Subscription = new Subscription;
 
  constructor(private httpService: ProductsRequestService, 
    private route: ActivatedRoute,
    private router: Router) {
     }

  ngOnInit(): void {
    this.formModal = new window.bootstrap.Modal(
      document.getElementById('filterModal')
    );
    this.productsDefId = document.getElementById('products-def');
    this.getCategories();
    this.getProducts('all');
  }
  getProducts(categorySlug: string){
    this.loadding = true;
    this.productSub = this.httpService
    .getProductsList(categorySlug)
    .subscribe({
      next:(productsList: APIResponse<Products>)=>{
        setTimeout(() => {
          this.loadding = false;
          this.products = productsList.data;
          if(this.products.length == 0){
            this.errorLength = 'لا يوجد منتجات';
          }else{
            this.errorLength = '';
          }
        }, 0);
      },
      error: (error :HttpErrorResponse)=>{
        if(error.error){
          setTimeout(() => {
            this.loadding = false;
            this.error = 'An unknown Error Occurred Check your Internet Connection Or Reload Your Page';
          }, 0);
        }
      }
    })
  }
  getCategories(){
    this.categorySub = this.httpService.
    getProductsCategories().
    subscribe({
      next: (categoryList: APIResponse2<Category>)=>{ 
        this.categories = categoryList.data;
      },
      error:(error : HttpErrorResponse)=>{
        if(error){
          this.error = 'An unknown Error Occurred Check your Internet Connection Or Reload Your Page';
        }
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
    if(this.categorySub){
      this.categorySub.unsubscribe();
    }
  }
   openFormModal() {
    this.formModal.show();
  }
}
