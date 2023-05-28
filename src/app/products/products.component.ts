import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { APIResponse, Products , APIResponse2, Category, CategoryFilter,BrandFilter, Category_Filter} from '../models/products.model';
import { MacPrefixService } from '../services/mac-prefix.service';
import { ProductsRequestService } from '../services/products-request.service';
import { SwiperOptions } from 'swiper';
import { ActionsService } from '../services/actions.service';
import { AuthService } from '../services/auth.service';
import { Regions, ResponseSuccess } from '../models/actions.model';
import { DatePipe } from '@angular/common';
import { ErrorHandlerService } from '../services/error-handler.service';
import { environment as env } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { AuthRemainderModalComponent } from '../auth-remainder-modal/auth-remainder-modal.component';
declare var window: any;

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  providers: [DatePipe]
})
export class ProductsComponent implements OnInit {
  @Input() categoriesSplash: any = [];
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
  filterbrandsOptions: any = [];
  brandsOptions: any = [];
  showBrandsOptions: boolean = false;
  fiter_carPlates: any = [];
  searchText: any;
  public sort: string = '';
  public products: Array<Products> = [];
  links: any = {};
  meta: any = {};
  isFavorite: boolean = false;
  // public categories : Array<Category> = [];
  active = 0;
  activeSub_brand = 0;
  brand_name: any;
  sub_brand_name: any;
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
  metaNo: any = [];
  owner_id: any;
  plate_town_filter_6: any;
  plate_type_filter_6: any;
  is_animating: boolean = false;
  private routeSub: Subscription = new Subscription;
  private productSub: Subscription = new Subscription;
  private categorySub : Subscription = new Subscription;
  private brandSub : Subscription = new Subscription;
  private filterSub : Subscription = new Subscription;

  valueMin: any = 0;
  valueMax: any = 8584040;
  value = [this.valueMin, this.valueMax];
  responsiveOptions!: any;
  formFilter = new FormGroup({
    min_price: new FormControl(''),
    max_price: new FormControl('')
  })
  formPlatesFilter = new FormGroup({
    min_price: new FormControl(''),
    max_price: new FormControl('')
  })
  filterAllProducts = new FormGroup({
    filterAll: new FormControl('')
  })
  constructor(private httpService: ProductsRequestService, 
    private router: Router,
    private route: ActivatedRoute,
    private macService: MacPrefixService,
    public actionService: ActionsService,
    public authService: AuthService,
    public datepipe: DatePipe,
    private http: HttpClient,
    private dialogRef: MatDialog,
    private errorHandel: ErrorHandlerService) {
      if(this.route.snapshot.fragment){
        if(this.route.snapshot.fragment == 'cars'){
          this.active = 1
        }else if(this.route.snapshot.fragment == 'car_plates'){
          this.active = 2
        }else{
          this.active = 0
        }
        this.getProducts(this.route.snapshot.fragment, 1);
        this.getCategoryFilter(this.route.snapshot.fragment);
        this.getBrandFilter(this.route.snapshot.fragment);
      }
    }
    // config: SwiperOptions = {
    //   slidesPerView: 15,
    //   allowSlideNext: true,
    //   allowSlidePrev: true,
    //   slidesPerGroup: 1,
    //   spaceBetween: 3,
    //   pagination: true,
    //   scrollbar: false,
    //   grabCursor: true,
    //   navigation: true,
    //   breakpoints: {
    //     992: {
    //       slidesPerView: 10
    //     },
    //     768: {
    //       slidesPerView: 7
    //     },
    //     575: {
    //       slidesPerView: 5
    //     },
    //     425: {
    //       slidesPerView: 4
    //     },
    //     375: {
    //       slidesPerView: 3
    //     },
    //     320: {
    //       slidesPerView: 3
    //     }
    //   }
    // };
  //   configSub_barnd: SwiperOptions = {
  //     slidesPerView: Math.min(10, this.filterbrandsOptions.length),
  //     spaceBetween: 0,
  //     navigation: false,
  //     pagination: false,
  //     scrollbar: false,
  //     grabCursor: true,
  //     breakpoints: {
  //       992: {
  //         slidesPerView: this.filterbrandsOptions.length > 7 ? 7 : this.filterbrandsOptions.length
  //       },
  //       768: {
  //         slidesPerView: this.filterbrandsOptions.length > 6 ? 6 : this.filterbrandsOptions.length
  //       },
  //       575: {
  //         slidesPerView: this.filterbrandsOptions.length > 5 ? 5 : this.filterbrandsOptions.length
  //       },
  //       425: {
  //         slidesPerView: 4 || this.filterbrandsOptions.length
  //       },
  //       375: {
  //         slidesPerView: 3 || this.filterbrandsOptions.length
  //       },
  //       320: {
  //         slidesPerView: 3 || this.filterbrandsOptions.length
  //       }
  //     }
  // }
  slickOptions = {
    slidesToShow: 11 || this.brandsOptions.length,
    centerMode: false,
    focusOnSelect: false,
    slidesToScroll: 1,
    infinite: true,
    centerPadding: "0",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 9
        }
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 8
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 6,
        }
      },
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 4,
        }
      },
      {
        breakpoint: 425,
        settings: {
          slidesToShow: 4,
        }
      },
      {
        breakpoint: 375,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 320,
        settings: {
          slidesToShow: 2,
        }
      }
    ]
  }
  slickOptionsSubBrands = {
    slidesToShow: 1,
    centerMode: false,
    focusOnSelect: false,
    slidesToScroll: 1,
    infinite: true,
    centerPadding: "0",
    // responsive: [
    //   {
    //     breakpoint: 1024,
    //     settings: {
    //       slidesToShow: 9
    //     }
    //   },
    //   {
    //     breakpoint: 992,
    //     settings: {
    //       slidesToShow: 8
    //     }
    //   },
    //   {
    //     breakpoint: 768,
    //     settings: {
    //       slidesToShow: 6,
    //     }
    //   },
    //   {
    //     breakpoint: 575,
    //     settings: {
    //       slidesToShow: 4,
    //     }
    //   },
    //   {
    //     breakpoint: 425,
    //     settings: {
    //       slidesToShow: 4,
    //     }
    //   },
    //   {
    //     breakpoint: 375,
    //     settings: {
    //       slidesToShow: 3,
    //     }
    //   },
    //   {
    //     breakpoint: 320,
    //     settings: {
    //       slidesToShow: 2,
    //     }
    //   }
    // ]
  }
  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.formModal = new window.bootstrap.Modal(
      document.getElementById('filterModal'),{backdrop: this.macService.backdrop}
    );
    this.faildProducts = new window.bootstrap.Modal(
      document.getElementById('faildProducts'),{backdrop: this.macService.backdrop}
    );
    // this.getCategories();
    // this.categoriesSplash = this.categories;    
    this.getProducts('all', 1);
    this.getRegions();
    this.owner_id = localStorage.getItem('userId')
  }
  getProducts(categorySlug: string, pageNo: number){
    this.loadding = true;
    this.formPlatesFilter.reset();
    this.categorySlug = categorySlug;
    this.filterbrandsOptions = [];
    this.productSub = this.httpService
    .getProductsList(categorySlug, pageNo)
    .subscribe({
      next:(productsList: APIResponse<Products>)=>{
        this.loadding = false;
        this.products = productsList.data;
        this.links = productsList.links;        
        this.meta = productsList.meta;
        // this.metaNo = this.meta.links?.slice(0,1).concat(this.meta.links?.slice(1, 4)).concat(this.meta.links?.slice(this.meta.links.length-1))
        // console.log(this.metaNo);
          if(this.products.length == 0){
            this.errorLength = 'لا يوجد منتجات';
          }else{
            this.errorLength = '';
          }
      },
      error:(err: HttpErrorResponse)=>{
        this.loadding = false;
        this.errorHandel.openErrorModa(err)
      }
    })
  }
  addToFav(product: any){
    this.is_animating = true;
    if(product.product_fav == false){
      this.http.get<ResponseSuccess>(`${env.api_url}/favourites/add-favourite/${product.id}`,this.actionService.httpOptions)
      .subscribe({
        next: res=>{
          product.product_fav = true  
        },
        error: (err: HttpErrorResponse)=>{
          this.errorHandel.openErrorModa(err)
        }
      })
    }else{
      this.http.get<ResponseSuccess>(`${env.api_url}/favourites/remove-favourite/${product.id}`,this.actionService.httpOptions)
      .subscribe({
        next: res=>{
          // this.actionService.handelRes(res)
          product.product_fav = false  
        },
        error: (err: HttpErrorResponse)=>{
          this.errorHandel.openErrorModa(err)
  
        }
      })
    }
  }
  applayForPagination(brand_filter: string,brand_Subfilter: string,page_num: number){
    this.load = true;
     this.filterSub = this.httpService.applayForPagination(this.valueMin,this.valueMax,brand_filter,brand_Subfilter,page_num).subscribe({
      next: (res: APIResponse<Products>)=>{
          this.load = false;
          this.formModal.hide();          
          this.products = res.data;
          this.links = res.links;
          this.meta = res.meta;         
          if(this.products.length == 0){
            this.errorLength = 'لا يوجد منتجات';
          }else{
            this.errorLength = '';
          }
      },
      error:(err: HttpErrorResponse)=>{
        this.load = false;
        this.errorHandel.openErrorModa(err)
      }
     })    
  }
  // getNewPage(current_page: number,pageNo: any,meta_path: string){        
  //   if(meta_path.includes('filters')){
  //     if(this.categorySlug == 'cars'){
  //       if(Number.isNaN(+pageNo)){
  //         if(pageNo.includes('Previous')){
  //           pageNo = current_page - 1;
  //           this.applayForPagination(this.brand_name,this.sub_brand_name,+pageNo);
  //         }else{
  //           pageNo = current_page + 1;
  //           this.applayForPagination(this.brand_name,this.sub_brand_name,+pageNo);
  //         }
  //       }else{
  //         this.applayForPagination(this.brand_name,this.sub_brand_name,+pageNo);
  //       }
  //     }else if (this.categorySlug == 'car_plates'){        
  //       if(Number.isNaN(+pageNo)){
  //         if(pageNo.includes('Previous')){
  //           pageNo = current_page - 1;
  //           this.onApplayPlatesFilters(+pageNo);
  //         }else{
  //           pageNo = current_page + 1;
  //           this.onApplayPlatesFilters(+pageNo);
  //         }
  //       }else{
  //         this.onApplayPlatesFilters(+pageNo);
  //       }
  //     }      
  //   }else{
  //     if(Number.isNaN(+pageNo)){
  //       if(pageNo.includes('Previous')){
  //         pageNo = current_page - 1;
  //         this.getProducts(this.categorySlug,+pageNo);
  //       }else{
  //         pageNo = current_page + 1;
  //         this.getProducts(this.categorySlug,+pageNo); 
  //       }
  //     }else{
  //       this.getProducts(this.categorySlug,+pageNo)
  //     }
  //   }
  // }
  paginate(event: any,meta_path: string){
    if(meta_path.includes('filters')){
      if(this.categorySlug == 'cars'){
        this.applayForPagination(this.brand_name,this.sub_brand_name,event.page+1);
      }else if (this.categorySlug == 'car_plates'){        
        this.onApplayPlatesFilters(event.page+1);
      }else{
        this.onApplayPlatesFilters(event.page+1);
      }      
    }else{
      this.getProducts(this.categorySlug,event.page+1)
    }
  } 
  getCategories(){
    this.categorySub = this.httpService.
    getProductsCategories().
    subscribe({
      next: (categoryList: APIResponse2<Category>)=>{ 
        this.categoriesSplash = categoryList.data;       
      },
      error:(err: HttpErrorResponse)=>{
        this.loadding = false;
        this.errorHandel.openErrorModa(err)
      }
    })
  }
  getCategoryFilter(categoryName: any){    
    this.categorySub = this.httpService.getCategoryFilters(categoryName).subscribe({
      next: (res: CategoryFilter)=>{
        this.filters = res;        
        this.valueMin = this.filters.data.price.min.toString();
        this.valueMax = this.filters.data.price.max.toString();
        this.filters.data.filters.forEach(filter=>{
          this.formFilter.addControl(filter.slug_name, new FormControl('')) 
        }) 
      },
      error:(err: HttpErrorResponse)=>{
        this.loadding = false;
        this.errorHandel.openErrorModa(err)
      }
    })
  }
  productDetails(id: number){
    this.router.navigate(['product-details', id])
  }
  sellerProfile(id:number){
    if(id == this.owner_id){
      this.router.navigate(['/adds',id])
    }else{
      this.router.navigate(['/seller-profile',id])
    }
  }
  getBrandFilter(categoryName: any){   
    if(categoryName =='car_plates'){
      this.showBrandsOptions = false
      this.brandsOptions = [];
      this.filterbrandsOptions = [];
      this.fiter_carPlates = [];
      this.show = false;
      this.showBtnAction = false;
      this.brandSub = this.httpService.getCategoryFilter(categoryName).subscribe({
        next: (res: Category_Filter)=>{
          this.fiter_carPlates = res.data.filters         
          this.showBtnAction = true;
          this.fiter_carPlates.forEach((e: any)=>{
            this.formPlatesFilter.addControl(e.slug_name, new FormControl('')) 
          })
        },
        error:(err: HttpErrorResponse)=>{
          this.faildProducts.show();
          this.show = false;
          this.showBtnAction = false;
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
    else if(categoryName =='cars'){
      this.fiter_carPlates = [];
      this.showBtnAction = false;
      this.brandSub = this.httpService.getBrandFilters().subscribe({
        next: (res: BrandFilter)=>{
          this.brands = res;          
          this.brandsOptions = this.brands.data;
          this.showBrandsOptions = true;
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
    else{
      this.brandsOptions = [];
      this.filterbrandsOptions = [];
      this.fiter_carPlates = [];
      this.show = false;
      this.showBrandsOptions = false;
      this.showBtnAction = false;
    }
  }
  apllyAllFilter(){
    let value = this.filterAllProducts.get('filterAll')?.value;
    if(value == 'new'){
      this.load = false;
      this.getProducts('all', 1);
      this.formModal.hide();
    }else{
      let region_id = localStorage.getItem('region_id');
      if(region_id == null){
        this.formModal.hide();
        this.dialogRef.open(AuthRemainderModalComponent,{
          data: {}
        })
      }else{
        this.load = true;
        this.filterSub = this.httpService.getCloseProducts(region_id,'all').subscribe({
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
            this.errorHandel.openErrorModa(err)
          }
        })  
      }
    }
  }
  onApplayFilters(){
    this.load = true;
    this.formFilter.get('min_price')?.setValue(this.valueMin);
    this.formFilter.get('max_price')?.setValue(this.valueMax);
    const formData = new FormData()
      for (const field in this.formFilter.controls) {
        if(this.formFilter.controls[field].value !== ''){          
          formData.append(field,this.formFilter.controls[field].value)
        } 
      }        
     this.filterSub = this.httpService.applayFilter(formData).subscribe({
      next: (res: APIResponse<Products>)=>{
          this.load = false;
          this.formModal.hide();
          this.products = res.data;
          this.links = res.links;
          this.meta = res.meta;          
          if(this.products.length == 0){
            this.errorLength = 'لا يوجد منتجات';
          }else{
            this.errorLength = '';
          }
      },
      error:(err: HttpErrorResponse)=>{
        this.load = false;
        this.errorHandel.openErrorModa(err)
      }
     })
  }
  onApplayFiltersKeys(brand_filter?: string, brand_Subfilter?: string, town_filter?: string,
    plate_type_filter?: string,
    plate_category_filter?: string,page_num?: number){
    this.load = true;
    this.brand_name = brand_filter;
    this.sub_brand_name = brand_Subfilter;
     this.filterSub = this.httpService.applayFilterKeys(this.valueMin,this.valueMax,brand_filter,brand_Subfilter,town_filter,plate_type_filter,plate_category_filter,page_num).subscribe({
      next: (res: APIResponse<Products>)=>{
          this.load = false;
          this.formModal.hide();          
          this.products = res.data;
          this.links = res.links;
          this.meta = res.meta;         
          if(this.products.length == 0){
            this.errorLength = 'لا يوجد منتجات';
          }else{
            this.errorLength = '';
          }
      },
      error:(err: HttpErrorResponse)=>{
        this.load = false;
        this.errorHandel.openErrorModa(err)
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
        this.load = false;
        this.errorHandel.openErrorModa(err)
      }
     })
  }
  change_plate_type(event: any){
    this.plate_type_filter_6 = event.value    
  }
  change_plate_twon(event: any){
    this.plate_town_filter_6 = event.target.value    
  }
  onApplayPlatesFilters(page_num?: number){
    this.load = true;       
     this.filterSub = this.httpService.applayForCar_plates(this.valueMin,this.valueMax,this.plate_town_filter_6,this.plate_type_filter_6,page_num).subscribe({
      next: (res: APIResponse<Products>)=>{
          this.load = false;
          this.formModal.hide();
          this.products = res.data;
          this.links = res.links;
          this.meta = res.meta;
          if(this.products.length == 0){
            this.errorLength = 'لا يوجد منتجات';
          }else{
            this.errorLength = '';
          }
      },
      error:(err: HttpErrorResponse)=>{
        this.load = false;
        this.errorHandel.openErrorModa(err)
      }
     })
  }
  openFormModal() {
    this.formModal.show();
  }
  getRegions(){
    this.filterSub = this.actionService.getRegions().subscribe({
      next: (res: Regions) => {
        this.regions = res.data;                
      },
      error:(err: HttpErrorResponse)=>{
        this.errorHandel.openErrorModa(err)
      }
    })
  }
  regionFilter(event: any){
    this.load = true;
    if(event.target.value == 'all'){
      this.getProducts(this.categorySlug, 1);
    }else{
      this.filterSub = this.actionService.regionFilter(event.target.value,this.categorySlug).subscribe({
        next: (res: APIResponse<Products>)=>{
          this.load = false;
          this.formModal.hide();
          this.products = res.data;
          this.links = res.links;
          this.meta = res.meta;          
          if(this.products.length == 0){
            this.errorLength = 'لا يوجد منتجات';
          }else{
            this.errorLength = '';
          }
        },
        error:(err: HttpErrorResponse)=>{
          this.load = false;
          this.errorHandel.openErrorModa(err)
        }
      })
    }
  }
  getSubFirlters(filter_name: string,event: any){
    if(filter_name == 'ماركة السيارة'){
      this.filterbrandsOptions = []
      this.filters.data.filters.forEach(filter => {
        if(filter.name_ar == "ماركة السيارة"){
          filter.filter_options.forEach(sub_filter =>{
            if(sub_filter.name == event.target.value){
              this.filterSub = this.httpService.applayBarndFilter(sub_filter.id).subscribe({
                next: (res: any)=>{
                  if(res.data != null){
                    this.filterbrandsOptions = res.data.filter_options;
                  }
                },
                error:(err: HttpErrorResponse)=>{
                  this.errorHandel.openErrorModa(err)
                }
              })       
            }
          })
        }
      })
    }
  }
  // ////scroll
  @ViewChild('navScrolled') navScrolled!: ElementRef;

  newScroll: boolean = false;
  @HostListener('window:scroll') onScroll(){
    if(window.pageYOffset > this.navScrolled.nativeElement.offsetTop){
      this.newScroll = true;
    }else{
      this.newScroll = false;
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
    if(this.filterSub){
      this.filterSub.unsubscribe();
    }
    if(this.brandSub){
      this.brandSub.unsubscribe();
    }
  }
}
