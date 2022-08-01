import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { APIResponse, Products , APIResponse2, Category, CategoryFilter} from '../models/products.model';
import { ProductsRequestService } from '../services/products-request.service';
declare var window: any;

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  filters: CategoryFilter = {
    data: {
      filters: [],
        price:{
            min: 0,
            max: 0
        }
    }
  }
  filterOptions :any= [];
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
  valueMin: number = 1000;
  valueMax: number = 98898;
  value = [this.valueMin, this.valueMax];
  
  formFilter = new FormGroup({})
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
  getCategoryFilter(categoryName: any){    
    this.categorySub = this.httpService.getCategoryFilters(categoryName).subscribe({
      next: (res: CategoryFilter)=>{
        this.filters = res;
        this.valueMin = this.filters.data.price.min
        this.valueMax = this.filters.data.price.max
        this.filters.data.filters.forEach(filter=>{
          this.formFilter.addControl(filter.slug_name, new FormControl('')) 
        })
      },
      error: err=>{
        console.log(err);
      }
    })
  }
  productDetails(id: number){
    this.router.navigate(['product-details', id])
  }
  onApplayFilters(price: any){
      console.log(price)
      for (const field in this.formFilter.controls) { 
      
      }  
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
