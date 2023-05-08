import { Injectable } from '@angular/core';
import { ProductsRequestService } from './products-request.service';
import { Router } from '@angular/router';
import { MacPrefixService } from './mac-prefix.service';
import { ActionsService } from './actions.service';
import { AuthService } from './auth.service';
import { APIResponse, Products } from '../models/products.model';

@Injectable({
  providedIn: 'root'
})
export class GetproductsService {
  
  filterbrandsOptions: any = [];
  brandsOptions: any = [];
  showBrandsOptions: boolean = false;
  fiter_carPlates: any = [];
  searchText: any;
  public sort: string = '';
  public products: Array<Products> = [];
  active = 0;
  show:boolean = false;
  showBtnAction: boolean = false;
  loadding = false;
  load: boolean = false;
  error: string = '';
  formModal: any;
  faildProducts: any;
  errMsg: string = '';
  errfilter: string = '';
  errorLength = '';
  activeClass: boolean = false;
  categorySlug: string = 'all';
  regions: any = [];
  owner_id: any;
  constructor(private httpService: ProductsRequestService, 
    private router: Router,
    private macService: MacPrefixService,
    public actionService: ActionsService,
    public authService: AuthService) {
    }
  getProducts(categorySlug: string){
    this.loadding = true;
    // this.formPlatesFilter.reset();
    this.categorySlug = categorySlug;
    this.httpService
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
      error:()=>{
        this.loadding = false;
      }
    })
  }
}
