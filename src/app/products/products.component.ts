import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { APIResponse, Products , APIResponse2, Category, CategoryFilter,BrandFilter} from '../models/products.model';
import { MacPrefixService } from '../services/mac-prefix.service';
import { ProductsRequestService } from '../services/products-request.service';
import SwiperCore, { SwiperOptions } from 'swiper';
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
  brands: BrandFilter = {
    data: {
      id: 0,
      category_id: 0,
      slug_name: '',
      name_ar: '',
      name_en: '',
      has_filters: false,
      filter_options: []
    }
  }
  filterbrandsOptions :any= [];
  brandsOptions :any= [];
  searchText: any;
  public sort: string = '';
  public products: Array<Products> = [];
  public categories : Array<Category> = [];
  active = 0;
  show:boolean = false;
  loadding = false;
  load: boolean = false;
  error: string = '';
  formModal: any;
  faildProducts: any;
  errMsg: string = '';
  errfilter: string = '';
  errorLength = '';
  activeClass: boolean = false;
  private routeSub: Subscription = new Subscription;
  private productSub: Subscription = new Subscription;
  private categorySub : Subscription = new Subscription;
  private brandSub : Subscription = new Subscription;
  private filterSub : Subscription = new Subscription;

  valueMin: number = 0;
  valueMax: number = 8584040;
  value = [this.valueMin, this.valueMax];
  
  formFilter = new FormGroup({
    min_price: new FormControl(''),
    max_price: new FormControl('')
  })

  constructor(private httpService: ProductsRequestService, 
    private router: Router,
    private macService: MacPrefixService) {}
    config: SwiperOptions = {
      slidesPerView: 10,
      spaceBetween: 0,
      navigation: false,
      pagination: false,
      scrollbar: false,
      breakpoints: {
        1440: {
          slidesPerView: 10,
        },
        1024: {
          slidesPerView: 7,
        },
        992: {
          slidesPerView: 5,
        },
        786: {
          slidesPerView: 4,
        },
        320: {
          slidesPerView: 2,
        }
    }
    };
  ngOnInit(): void {
    this.formModal = new window.bootstrap.Modal(
      document.getElementById('filterModal'),{backdrop: this.macService.backdrop}
    );
    this.faildProducts = new window.bootstrap.Modal(
      document.getElementById('faildProducts'),{backdrop: this.macService.backdrop}
    );
    this.getCategories();
    this.getProducts('all');
  }
  getProducts(categorySlug: string){
    this.loadding = true;
    this.productSub = this.httpService
    .getProductsList(categorySlug)
    .subscribe({
      next:(productsList: APIResponse<Products>)=>{
        this.loadding = false;
          this.products = productsList.data;
          if(this.products.length == 0){
            this.errorLength = 'لا يوجد منتجات';
          }else{
            this.errorLength = '';
          }
      },
      error:(err: HttpErrorResponse)=>{
        this.faildProducts.show();
        if(err.error.data){
          this.errMsg = err.error.data;
        } else{
          if(err.statusText == 'Unauthorized'){
            this.errMsg = 'يجب انشاء حساب اولا';
          }else{
            this.errMsg = err.statusText;
          }
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
      error:(err: HttpErrorResponse)=>{
        this.faildProducts.show();
        if(err.error.data){
          this.errMsg = err.error.data;
        } else{
          if(err.statusText == 'Unauthorized'){
            this.errMsg = 'يجب انشاء حساب اولا';
          }else{
            this.errMsg = err.statusText;
          }
        }
      }
    })
  }
  getCategoryFilter(categoryName: any){    
    this.categorySub = this.httpService.getCategoryFilters(categoryName).subscribe({
      next: (res: CategoryFilter)=>{
        this.filters = res;
        this.valueMin = this.filters.data.price.min;
        this.valueMax = this.filters.data.price.max;
        this.filters.data.filters.forEach(filter=>{
          this.formFilter.addControl(filter.slug_name, new FormControl('')) 
        }) 
      },
      error:(err: HttpErrorResponse)=>{
        this.faildProducts.show();
        if(err.error.data){
          this.errMsg = err.error.data;
        } else{
          if(err.statusText == 'Unauthorized'){
            this.errMsg = 'يجب انشاء حساب اولا';
          }else{
            this.errMsg = err.statusText;
          }
        }
      }
    })
  }
  productDetails(id: number){
    this.router.navigate(['product-details', id])
  }
  sellerProfile(id:number){
    this.router.navigate(['seller-profile',id])
  }
  getBrandFilter(categoryName: any){   
    if(categoryName =='all' || categoryName =='car_plates'){
      this.brandsOptions = [];
      this.filterbrandsOptions = [];
      this.show = false;
    } else{
      this.brandSub = this.httpService.getBrandFilters().subscribe({
        next: (res: BrandFilter)=>{
          this.brands = res;
          this.brandsOptions = this.brands.data;
          this.show = true;
        },
        error:(err: HttpErrorResponse)=>{
          this.faildProducts.show();
          this.show = false;
          if(err.error.data){
            this.errMsg = err.error.data;
          } else{
            if(err.statusText == 'Unauthorized'){
              this.errMsg = 'يجب انشاء حساب اولا';
            }else{
              this.errMsg = err.statusText;
            }
          }
        }
      })
    }
  }
  onApplayFilters(){
    this.load = true;
    this.formFilter.get('min_price')?.setValue(this.valueMin);
    this.formFilter.get('max_price')?.setValue(this.valueMax);
    const formData = new FormData()
      for (const field in this.formFilter.controls) { 
        formData.append(field,this.formFilter.controls[field].value)
      }        
     this.filterSub = this.httpService.applayFilter(formData).subscribe({
      next: (res: APIResponse<Products>)=>{
          this.load = false;
          this.formModal.hide();
          this.products = res.data;
          if(this.products.length == 0){
            this.errorLength = 'لا يوجد منتجات';
          }else{
            this.errorLength = '';
          }
      },
      error:(err: HttpErrorResponse)=>{
        this.load = false;
        if(err.error.data){
          this.errfilter = err.error.data;
        } else{
          if(err.statusText == 'Unauthorized'){
            this.errfilter = 'يجب انشاء حساب اولا';
          }else{
            this.errfilter = err.statusText;
          }
        }
      }
     })
  }
  onApplayFiltersKeys(brand_filter?: string, brand_Subfilter?: string){
    this.load = true;
     this.filterSub = this.httpService.applayFilterKeys(brand_filter,brand_Subfilter).subscribe({
      next: (res: APIResponse<Products>)=>{
          this.load = false;
          this.formModal.hide();
          this.products = res.data;
          if(this.products.length == 0){
            this.errorLength = 'لا يوجد منتجات';
          }else{
            this.errorLength = '';
          }
      },
      error:(err: HttpErrorResponse)=>{
        this.load = false;
        if(err.error.data){
          this.errfilter = err.error.data;
        } else{
          if(err.statusText == 'Unauthorized'){
            this.errfilter = 'يجب انشاء حساب اولا';
          }else{
            this.errfilter = err.statusText;
          }
        }
      }
     })    
  }
  onApplayBrandFilters(filter_key: number){
    this.loadding = true;   
    this.filterbrandsOptions = [];
    this.filterSub = this.httpService.applayBarndFilter(filter_key).subscribe({
      next: (res: any)=>{
          this.loadding = false;
          if(res.data != null){
            this.filterbrandsOptions = res.data.filter_options;
          }
      },
      error:(err: HttpErrorResponse)=>{
        this.loadding = false;
        if(err.error.data){
          this.errfilter = err.error.data;
        } else{
          if(err.statusText == 'Unauthorized'){
            this.errfilter = 'يجب انشاء حساب اولا';
          }else{
            this.errfilter = err.statusText;
          }
        }
      }
     })
  }
  openFormModal() {
    this.formModal.show();
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
    if(this.filterSub){
      this.filterSub.unsubscribe();
    }
    if(this.brandSub){
      this.brandSub.unsubscribe();
    }
  }
}
