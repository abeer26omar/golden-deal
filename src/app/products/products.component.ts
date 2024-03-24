import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, HostListener, OnInit, ViewChild, OnDestroy, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { APIResponse, Products , APIResponse2, Category, CategoryFilter,BrandFilter, Category_Filter} from '../models/products.model';
import { MacPrefixService } from '../services/mac-prefix.service';
import { ProductsRequestService } from '../services/products-request.service';
import { ActionsService } from '../services/actions.service';
import { AuthService } from '../services/auth.service';
import { Regions, ResponseSuccess } from '../models/actions.model';
import { DatePipe } from '@angular/common';
import { ErrorHandlerService } from '../services/error-handler.service';
import { environment as env } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { AuthRemainderModalComponent } from '../auth-remainder-modal/auth-remainder-modal.component';
import { GoBackService } from '../services/go-back.service';
import { Paginator } from 'primeng/paginator';
import { CookieService } from 'ngx-cookie-service';

declare var window: any;

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  providers: [DatePipe]
})
export class ProductsComponent implements OnInit, AfterViewInit, OnDestroy {
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
  public categories : Array<Category> = [];
  active = 0;
  activeSub_brand = 0;
  brand_name: any;
  sub_brand_name: any;
  show: boolean = false;
  showBtnAction: boolean = false;
  loadding = false;
  load: boolean = false;
  loader: boolean = false;
  error: string = '';
  formModal: any;
  faildProducts: any;
  errMsg: string = '';
  errfilter: string = '';
  errorLength = '';
  activeClass: boolean = false;
  categorySlug: string = 'all';
  currentPage: number = 1;
  regions: any = [];
  metaNo: any = [];
  owner_id: any;
  mac: boolean = false;
  slickOptionsSubBrands: any;
  plate_town_filter_6: any;
  plate_type_filter_6: any;
  region_filter: any;
  filterBrandKey: any;
  selectedSlideIndex: any = -1;
  selectedSlideSubBrandIndex: any = -1;
  is_animating: boolean = false;
  brandName: string = '';
  isAllFilterActive: boolean = true;
  private routeSub: Subscription = new Subscription;
  private productSub: Subscription = new Subscription;
  private categorySub : Subscription = new Subscription;
  private brandSub : Subscription = new Subscription;
  private filterSub : Subscription = new Subscription;
  @ViewChild('productsContainer') productsContainer!: ElementRef;
  @ViewChild(Paginator) paginator!: Paginator;
  @ViewChild('paginatorPages') paginatorPages: any;

  valueMin: any = 0;
  valueMax: any = 8584040;
  value = [this.valueMin, this.valueMax];
  responsiveOptions!: any;
  formFilter = new FormGroup({
    min_price: new FormControl(''),
    max_price: new FormControl('')
  });
  formPlatesFilter = new FormGroup({
    min_price: new FormControl(''),
    max_price: new FormControl('')
  });
  filterAllProducts = new FormGroup({
    filterAll: new FormControl('')
  });
  constructor(private httpService: ProductsRequestService, 
    private router: Router,
    public route: ActivatedRoute,
    private macService: MacPrefixService,
    public actionService: ActionsService,
    public authService: AuthService,
    public datepipe: DatePipe,
    private http: HttpClient,
    private dialogRef: MatDialog,
    private errorHandel: ErrorHandlerService,
    private gobackservice: GoBackService,
    private cookieService: CookieService) {
      if(this.gobackservice.goBackState){
        this.currentPage = this.gobackservice.pageNumber;        
        this.categorySlug = this.gobackservice.categorySlug;
        this.getBrandFilter(this.gobackservice.categorySlug);
        this.getCategoryFilter(this.gobackservice.categorySlug);
        if(this.gobackservice.categorySlug === 'car_plates'){
          this.active = 2;
          if(this.gobackservice.carPlateType !== 'undefined'){
            this.plate_type_filter_6 = this.gobackservice.carPlateType;
            this.onApplayPlatesFilters(this.gobackservice.pageNumber);
          }else{
            this.getProducts(this.gobackservice.categorySlug, this.gobackservice.pageNumber);
          }
        }else if(this.gobackservice.categorySlug === 'cars'){
          this.active = 1;
          if(this.gobackservice.brand_name == 'undefined' && this.gobackservice.sub_brand_name == 'undefined'){
            this.getProducts(this.gobackservice.categorySlug, this.gobackservice.pageNumber);
          }else{
            this.gobackservice.brand_name !== undefined ? this.brand_name = this.gobackservice.brand_name : undefined;
            this.gobackservice.sub_brand_name !== undefined ? this.sub_brand_name = this.gobackservice.sub_brand_name : undefined;
              if(this.gobackservice.filterBrandKey !== 'undefined'){
                this.onApplayBrandFilters(this.gobackservice.filterBrandKey);
                this.selectedSlideIndex = +this.gobackservice.selectedSlideIndex;
                this.selectedSlideSubBrandIndex = +this.gobackservice.selectedSlideSubBrandIndex;
              }
              this.onApplayFiltersKeys(this.gobackservice.brand_name,this.gobackservice.sub_brand_name,this.gobackservice.region_filter)
          }
        }else{
          if(this.gobackservice.region_filter !== 'undefined'){
            this.region_filter = this.gobackservice.region_filter;
            this.getRegionFilterForBack();
          }else{
            this.getProducts(this.gobackservice.categorySlug, this.gobackservice.pageNumber);
          }
        }
      }else{
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
    }
    slickOptions = {
      slidesToShow: 11,
      centerMode: false,
      focusOnSelect: false,
      slidesToScroll: 1,
      infinite: false,
      centerPadding: "0",
      rtl: true,
      responsive: [
        {
          breakpoint: 1440,
          settings: {
            slidesToShow: 10
          }
        }, 
        {
          breakpoint: 1200,
          settings: {
            slidesToShow: 8
          }
        },
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 8
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
  onCarouselInit(slickModal: any) {
    setTimeout(()=>{
      if (slickModal && slickModal.slickGoTo) {
        slickModal.slickGoTo(this.selectedSlideIndex);
      }
    }, 100)
  }
  onCarouselSubBrandInit(slickModal: any) {
    this.isAllFilterActive = true;
    setTimeout(()=>{
      if (slickModal && slickModal.slickGoTo) {
        slickModal.slickGoTo(this.selectedSlideSubBrandIndex);
      }
    }, 100)
  }
  onSlideChanged(event: any) {
    this.selectedSlideIndex = event.currentSlide;
  }
  onSlideSubBrandChanged(event: any) {
    this.selectedSlideSubBrandIndex = event.currentSlide;
  }
  onSlideClicked(i: number, name?: string) {
    this.selectedSlideIndex = i;
    this.brandName = name || '';
  }
  onSlideSubBrandClicked(i: number) {
    this.isAllFilterActive = false;
    this.selectedSlideSubBrandIndex = i;
  }
  getSlickOptionsSubBrands(length: any){
    return {
      slidesToShow: Math.min(length, 7),
      centerMode: false,
      focusOnSelect: false,
      slidesToScroll: 1,
      infinite: false,
      cssEase: 'linear',
      centerPadding: "0",
      rtl: true,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: Math.min(length, 5)
          }
        },
        {
          breakpoint: 992,
          settings: {
            slidesToShow: Math.min(length, 4)
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: Math.min(length, 4),
          }
        },
        {
          breakpoint: 575,
          settings: {
            slidesToShow: Math.min(length, 3),
          }
        },
        {
          breakpoint: 425,
          settings: {
            slidesToShow: Math.min(length, 3),
          }
        },
        {
          breakpoint: 375,
          settings: {
            slidesToShow: Math.min(length, 2),
          }
        },
        {
          breakpoint: 320,
          settings: {
            slidesToShow: Math.min(length, 1),
          }
        }
      ]
    }
  }
  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.formModal = new window.bootstrap.Modal(
      document.getElementById('filterModal'),{backdrop: this.macService.backdrop}
    );
    this.faildProducts = new window.bootstrap.Modal(
      document.getElementById('faildProducts'),{backdrop: this.macService.backdrop}
    );
    this.getCategories();
    if(this.macService.operatingSysDetect()){
      this.mac = true;
    }else{
      this.mac = false;
    }
    if(this.gobackservice.goBackState){
    }else{
      this.getProducts(this.route.snapshot.fragment ? this.route.snapshot.fragment: 'all', 1);
    }
    this.getRegions();
    this.owner_id = localStorage.getItem('userId') || this.cookieService.get('userId');
  }
  ngAfterViewInit() {
    
  }
  getProducts(categorySlug: string, pageNo: number){
    this.loader = true;
    this.errorLength = '';
    this.formPlatesFilter.reset();
    this.categorySlug = categorySlug;
    this.filterbrandsOptions = [];
    this.productSub = this.httpService
    .getProductsList(categorySlug, pageNo)
    .subscribe({
      next:(productsList: APIResponse<Products>)=>{
        this.loader = false;
        this.products = productsList.data;
        this.links = productsList.links;        
        this.meta = productsList.meta;
          if(this.products.length == 0){
            this.errorLength = 'لا يوجد منتجات';
          }else{
            this.errorLength = '';
          }
      },
      error:(err: HttpErrorResponse)=>{
        this.loader = false;
        this.errorHandel.openErrorModa(err);
      }
    })
  }
  addToFav(product: any, event: MouseEvent){
    this.is_animating = true;
    if(this.authService.IsloggedIn()){
      if(product.product_fav == false){
        this.http.get<ResponseSuccess>(`${env.api_url}/favourites/add-favourite/${product.id}`,this.actionService.httpOptions)
        .subscribe({
          next: res=>{
            (event.target as HTMLElement).classList.toggle('heart_beat');
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
    } else{
      this.dialogRef.open(AuthRemainderModalComponent,{
        data: {}
      })
      // this.route.navigate(['/register']);
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
          this.scrollToproductsContainer()
      },
      error:(err: HttpErrorResponse)=>{
        this.load = false;
        this.errorHandel.openErrorModa(err)
        this.scrollToproductsContainer()
      }
     })    
  }
  paginate(event: any,meta_path: string){
    this.currentPage = event;
    this.meta.current_page = event;
    if(meta_path.includes('filters')){
      if(this.categorySlug == 'cars'){
        this.applayForPagination(this.brand_name !== 'undefined' ? this.brand_name : undefined,
        this.sub_brand_name !== 'undefined' ? this.sub_brand_name : undefined,event);
      }else if (this.categorySlug == 'car_plates'){        
        this.onApplayPlatesFilters(event);
      }else{
        this.onApplayPlatesFilters(event);
      }      
    }else{
      this.getProducts(this.categorySlug,event);
      setTimeout(()=>{
        this.scrollToproductsContainer();
      },80)
    }
  }
  scrollToproductsContainer(){
    this.productsContainer.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  getCategories(){
    this.categorySub = this.httpService.
    getProductsCategories().
    subscribe({
      next: (categoryList: APIResponse2<Category>)=>{ 
        this.categories = categoryList.data;               
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
    const fragment = {
      categorySlug: this.categorySlug,
      pageNumber: this.currentPage,
      carPlateType: this.plate_type_filter_6,
      townFilter: this.plate_town_filter_6,
      brandFilter: this.brand_name, 
      brandSubFilter: this.sub_brand_name,
      regionFilter: this.region_filter,
      filterBrandKey: this.filterBrandKey,
      selectedSlideIndex: this.selectedSlideIndex,
      selectedSlideSubBrandIndex: this.selectedSlideSubBrandIndex 
    };
    const fragmentString = Object.entries(fragment)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    const navigationExtras: NavigationExtras = {
      fragment: fragmentString,
    };
    this.router.navigate(['product-details', id], navigationExtras);
    const element = document.getElementById(`${id}`);
    this.gobackservice.getElement(element);
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
    this.errorLength = '';
    if(value == 'new'){
      this.load = false;
      this.getProducts('all', 1);
      this.formModal.hide();
    }else{
      let region_id = localStorage.getItem('region_id') || this.cookieService.get('userId');
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
  // for form submit 
  onApplayFilters(){
    this.loader = true;
    this.errorLength = '';
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
          this.loader = false;
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
        this.loader = false;
        this.errorHandel.openErrorModa(err)
      }
     })
  }
  onApplayFiltersKeys(brand_filter?: string, brand_Subfilter?: string, town_filter?: string,
    plate_type_filter?: string,
    plate_category_filter?: string,page_num?: number){
    this.load = true;
    this.loader = true;
    this.errorLength = '';            
    this.brand_name = brand_filter;
    this.sub_brand_name = brand_Subfilter;
     this.filterSub = this.httpService.applayFilterKeys(this.valueMin,this.valueMax,brand_filter,brand_Subfilter,town_filter,plate_type_filter,plate_category_filter,page_num).subscribe({
      next: (res: APIResponse<Products>)=>{
          this.load = false;
          this.loader = false;
          if(this.formModal){
            this.formModal.hide();
          }
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
        this.loader = false;
        this.errorHandel.openErrorModa(err)
      }
     })    
  }
  onApplayBrandFilters(filter_key: number){
    this.load = true;
    this.loader = true;   
    this.filterbrandsOptions = [];
    this.errorLength = '';
    this.filterBrandKey = filter_key;
    this.filterSub = this.httpService.applayBarndFilter(filter_key).subscribe({
      next: (res: any)=>{
          this.load = false;
          this.loader = false;            
          if(res.data != null){
            this.filterbrandsOptions = res.data.filter_options;
            this.slickOptionsSubBrands = this.getSlickOptionsSubBrands(this.filterbrandsOptions.length)
          }
      },
      error:(err: HttpErrorResponse)=>{
        this.load = false;
        this.loader = false;            
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
    this.loader = true;
    this.errorLength = '';                  
     this.filterSub = this.httpService.applayForCar_plates(this.valueMin,this.valueMax,this.plate_town_filter_6,this.plate_type_filter_6,page_num).subscribe({
      next: (res: APIResponse<Products>)=>{
          this.load = false;
          this.loader = false;
          this.formModal.hide();
          this.products = res.data;
          this.links = res.links;
          this.meta = res.meta;
          if(this.products.length == 0){
            this.errorLength = 'لا يوجد منتجات';
          }else{
            this.errorLength = '';
          }
          this.scrollToproductsContainer();
      },
      error:(err: HttpErrorResponse)=>{
        this.load = false;
        this.loader = false;
        this.errorHandel.openErrorModa(err);
        this.scrollToproductsContainer();
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
  getRegionFilter(event: any){
    this.load = true;
    this.region_filter = event.target.value;
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
  getRegionFilterForBack(){
    this.filterSub = this.actionService.regionFilter(this.region_filter ,this.categorySlug).subscribe({
      next: (res: APIResponse<Products>)=>{
        this.load = false;
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
  ngOnDestroy() :void{
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
