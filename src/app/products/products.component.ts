import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { APIResponse, Products , APIResponse2, Category, CategoryFilter,BrandFilter, Category_Filter} from '../models/products.model';
import { MacPrefixService } from '../services/mac-prefix.service';
import { ProductsRequestService } from '../services/products-request.service';
import Swiper, { SwiperOptions } from 'swiper';
import { ActionsService } from '../services/actions.service';
import { AuthService } from '../services/auth.service';
import { Regions } from '../models/actions.model';
import { DatePipe } from '@angular/common';
declare var window: any;

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  providers: [DatePipe]
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
  filterbrandsOptions: any = [];
  brandsOptions: any = [];
  showBrandsOptions: boolean = false;
  fiter_carPlates: any = [];
  searchText: any;
  public sort: string = '';
  public products: Array<Products> = [];
  links: any ={};
  meta: any = {};
  public categories : Array<Category> = [];
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
    public datepipe: DatePipe) {
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
    config: SwiperOptions = {
      // slidesPerView: 11,
      slidesPerView: 'auto',
      spaceBetween: 10,
      navigation: false,
      pagination: false,
      scrollbar: false,
      grabCursor: true,
    };
    configSubBrands: SwiperOptions = {
      // slidesPerView: 11,
      slidesPerView: 'auto',
      spaceBetween: 10,
      navigation: false,
      pagination: false,
      scrollbar: false,
      grabCursor: true,
    };
    swiper!: Swiper;
    swiperSubrand!: Swiper;
    onSwiper(swiper: Swiper){
      this.swiper = swiper;
      this.swiper.slides.forEach((slide, index) => {
        slide.addEventListener('click', () => {
          this.swiper.slideTo(index);
          this.swiper.slides.forEach((slide) => {
            slide.classList.remove('swiper-slide-active');
          });
          slide.classList.add('swiper-slide-active');
        });
      });
    }
    onSwiperSubBrand(swiperSubrand: Swiper){
      this.swiperSubrand = swiperSubrand;
      this.swiperSubrand.slides.forEach((slide, index) => {
        slide.addEventListener('click', () => {
          this.swiperSubrand.slideTo(index);
          this.swiperSubrand.slides.forEach((slide) => {
            slide.classList.remove('active');
          });
          slide.classList.add('active');
        });
      });
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
    this.getProducts('all', 1);
    this.getRegions();
    this.owner_id = localStorage.getItem('userId')
  }
  getProducts(categorySlug: string, pageNo: number){
    this.loadding = true;
    this.formPlatesFilter.reset();
    this.categorySlug = categorySlug;
    this.productSub = this.httpService
    .getProductsList(categorySlug, pageNo)
    .subscribe({
      next:(productsList: APIResponse<Products>)=>{
        this.loadding = false;
        this.products = productsList.data;
        this.links = productsList.links;
        this.meta = productsList.meta;                          
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
  getNewPage(current_page: number,pageNo: any){
      if(Number.isNaN(+pageNo)){
        if(pageNo.includes('Previous')){
          pageNo = current_page - 1;
          this.getProducts('all',+pageNo);
        }else{
          pageNo = current_page + 1;
          this.getProducts('all',+pageNo); 
        }
      }else{
        this.getProducts('all',+pageNo)
      }
  }
  getCategories(){
    this.categorySub = this.httpService.
    getProductsCategories().
    subscribe({
      next: (categoryList: APIResponse2<Category>)=>{ 
        this.categories = categoryList.data;       
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
    this.load = true;
    let value = this.filterAllProducts.get('filterAll')?.value;
    if(value == 'new'){
      this.load = false;
      this.getProducts('all', 1);
      this.formModal.hide();
    }else{
      let region_id = localStorage.getItem('region_id');
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
        error:()=>{
          this.load = false;
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
      error:()=>{
        this.load = false;
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
      error:()=>{
        this.load = false;
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
      error:()=>{
        this.loadding = false;
      }
     })
  }
  onApplayPlatesFilters(){
    this.load = true;
    this.formPlatesFilter.get('min_price')?.setValue('0');
    this.formPlatesFilter.get('max_price')?.setValue('8584040');
    const formData = new FormData()
      for (const field in this.formPlatesFilter.controls) { 
        formData.append(field,this.formPlatesFilter.controls[field].value)
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
      error:()=>{
        this.load = false;
      }
     })
  }
  openFormModal() {
    this.formModal.show();
  }
  getRegions(){
    this.filterSub = this.actionService.getRegions().subscribe({
      next: (res: Regions) => {
        this.regions = res.data        
      }
    })
  }
  regionFilter(event: any){
    this.load = true;
    if(event.target.value == 'all'){
      this.getProducts('all', 1);
    }else{
      this.filterSub = this.actionService.regionFilter(event.target.value,this.categorySlug).subscribe({
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
        error:()=>{
          this.load = false;
        }    })
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
