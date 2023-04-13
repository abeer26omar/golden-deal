import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, from } from 'rxjs';
import { APIResponse2, Category, CategoryFilter, NewProduct} from '../../models/products.model';
import { ProductsRequestService } from 'src/app/services/products-request.service';
import { HttpErrorResponse } from '@angular/common/http';
import { environment as env } from 'src/environments/environment';
import { MacPrefixService } from 'src/app/services/mac-prefix.service';
import { NgOtpInputConfig } from 'ng-otp-input';
import { ActionsService } from 'src/app/services/actions.service';
import { Regions } from 'src/app/models/actions.model';
import { SwiperOptions } from 'swiper';

declare var window: any;

@Component({
  selector: 'app-new-add',
  templateUrl: './new-add.component.html',
  styleUrls: ['./new-add.component.css']
})
export class NewAddComponent implements OnInit {
  step: any = 1;
  active = 0;
  defaultImage_add: boolean = true;
  modelSuccessNewProduct: any;
  modelAddImages: any;
  addFaild: any;
  images : string[] = [];
  filtersArr: any = [];
  error: string = '';
  errorAdd: string = '';
  error_CarPlate: string = '';
  load: boolean = false;
  submitted: boolean = false;
  error_CarPlate_bool: boolean = false;
  file!: File;
  imgSrc1: any;
  imgSrc2: any;
  imgSrc3: any;
  imgSrc4: any;
  imgSrc5: any;
  imgSrc6: any;
  imgSrc7: any;
  ownership: any;
  negotiable: boolean = false;
  newFormControl!: any;
  plate_chars_filter_6: any;
  plate_chars_en_filter_6: any;
  plate_numbers_filter_6: any;
  plate_numbers_en_filter_6: any;
  input_number: any = [];
  regions: any = [];
  public categories : Array<Category> = [];
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
  valueArr: any = [];
  categoryName: string = ''
  inputValue: any;
  catergoryId!:number;
  ownerId = localStorage.getItem('userId');
  NewProductRes: NewProduct = {
    data:{
      order_code: 0,
      msg: ''
    }
  }
  plates_chars: any = [
    { char: 'ا' , trans: 'A' },
    { char: 'ب' , trans: 'B' },
    { char: 'ح' , trans: 'J '},
    { char: 'د' , trans: 'D' },
    { char: 'ر' , trans: 'R' },
    { char: 'س' , trans: 'S' },
    { char: 'ص' , trans: 'X' },
    { char: 'ط' , trans: 'T' },
    { char: 'ع' , trans: 'E' },
    { char: 'ق' , trans: 'G' },
    { char: 'ك' , trans: 'K' },
    { char: 'ل' , trans: 'L' },
    { char: 'م' , trans: 'Z' },
    { char: 'ن' , trans: 'N' },
    { char: 'هـ' , trans: 'H' },
    { char: 'و' , trans: 'U' },
    { char: 'ى' , trans: 'V' }
  ]
  plates_numbers: any = [
    { char: '٠' , trans: '0' },
    { char: '١' , trans: '1' },
    { char: '٢' , trans: '2 '},
    { char: '٣' , trans: '3' },
    { char: '٤' , trans: '4' },
    { char: '٥' , trans: '5' },
    { char: '٦' , trans: '6' },
    { char: '٧' , trans: '7' },
    { char: '٨' , trans: '8' },
    { char: '٩' , trans: '9' },
  ]
  configEn:NgOtpInputConfig = {
    allowNumbersOnly: false,
    length: 3,
    allowKeyCodes: [],
    isPasswordInput: false,
    disableAutoFocus: true,
    placeholder: '',
    containerStyles:{
      'direction': 'rtl'
    },
    inputStyles:{
      'margin-left': '8px',
      'margin-right': '0px'
    }
  }
  filterbrandsOptions :any= [];
  private categorySub : Subscription = new Subscription;
  private filterSub : Subscription = new Subscription;
  private sendSub: Subscription = new Subscription;
  constructor(private httpService: ProductsRequestService,
    private router: Router,
    private macService: MacPrefixService,
    private actionService: ActionsService,
    private productsService: ProductsRequestService ) {}
    
    myForm = new FormGroup({
      agrement: new FormControl('', [Validators.required]),
      seller_phone: new FormControl(''),
      productCategory: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required]),
      desc: new FormControl('', [Validators.required]),
      owner_id: new FormControl(this.ownerId),
      negotiable: new FormControl(''),
      category_id: new FormControl(''),
      region_id: new FormControl('', [Validators.required]),
      product_image_1: new FormControl('',[Validators.required]),
      product_image_2: new FormControl('',[Validators.required]),
      product_image_3: new FormControl('',[Validators.required]),
      product_image_4: new FormControl('',[Validators.required]),
      product_image_5: new FormControl(''),
      product_image_6: new FormControl(''),
      product_image_7: new FormControl(''),
      plate_chars_filter_6: new FormGroup({
        plate_chars_ar_1: new FormControl('',[Validators.required]),
        plate_chars_ar_2: new FormControl(''),
        plate_chars_ar_3: new FormControl(''),
      }),
      plate_chars_en_filter_6: new FormGroup({
        plate_chars_en_1: new FormControl(''),
        plate_chars_en_2: new FormControl(''),
        plate_chars_en_3: new FormControl(''),
      }),
      plate_numbers_filter_6: new FormGroup({
        plate_number_ar_1: new FormControl('',[Validators.required]),
        plate_number_ar_2: new FormControl(''),
        plate_number_ar_3: new FormControl(''),
        plate_number_ar_4: new FormControl('')
      }),
      plate_numbers_en_filter_6: new FormGroup({
        plate_number_en_1: new FormControl(''),
        plate_number_en_2: new FormControl(''),
        plate_number_en_3: new FormControl(''),
        plate_number_en_4: new FormControl('')
      })
    })
    get f(){
      return this.myForm.controls;
    }
  ngOnInit(): void {
      this.getCategories();
      this.modelSuccessNewProduct = new window.bootstrap.Modal(
        document.getElementById('modelSuccessNewProduct'),{backdrop: this.macService.backdrop}
      );  
      this.modelAddImages = new window.bootstrap.Modal(
        document.getElementById('modelAddImages'),{backdrop: this.macService.backdrop}
      );
      this.addFaild = new window.bootstrap.Modal(
        document.getElementById('addFaild'),{backdrop: this.macService.backdrop}
      );
      this.getRegions();
  }
  onNegotiable(){
    if(this.negotiable == false){
      this.negotiable = true;
      this.f['negotiable'].setValue(1)
      this.f['price'].disable()
      this.f['price'].setValue('0')
    }else{
      this.negotiable = false;
      this.f['negotiable'].setValue(0)
      this.f['price'].enable()
      this.f['price'].setValue('')
    }
  }
  onFileChange(key: number,event: any){
    let reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    this.file =<File>event.target.files[0];
    switch(key){
      case 1:
        reader.onload = ()=>{
          this.imgSrc1 = reader.result;
        }
        this.myForm.get('product_image_1')?.patchValue(this.file,this.file.name);
        break;
      case 2:
        reader.onload = ()=>{
          this.imgSrc2 = reader.result;
        }
        this.myForm.get('product_image_2')?.patchValue(this.file,this.file.name);
      break;
      case 3:
        reader.onload = ()=>{
          this.imgSrc3 = reader.result;
        }
        this.myForm.get('product_image_3')?.patchValue(this.file,this.file.name);
      break;
      case 4:
        reader.onload = ()=>{
          this.imgSrc4 = reader.result;
        }
        this.myForm.get('product_image_4')?.patchValue(this.file,this.file.name);
      break;
      case 5:
        reader.onload = ()=>{
          this.imgSrc5 = reader.result;
        }
        this.myForm.get('product_image_5')?.patchValue(this.file,this.file.name);
      break;
      case 6:
        reader.onload = ()=>{
          this.imgSrc6 = reader.result;
        }
        this.myForm.get('product_image_6')?.patchValue(this.file,this.file.name);
      break;
      case 7:
        reader.onload = ()=>{
          this.imgSrc7 = reader.result;
        }
        this.myForm.get('product_image_7')?.patchValue(this.file,this.file.name);
      break;
    }
  }
  config: SwiperOptions = {
    slidesPerView: 5,
    spaceBetween: 10,
    navigation: false,
    pagination: false,
    scrollbar: false,
    grabCursor: true,
    breakpoints: {
      992: {
        slidesPerView: 5
      },
      768: {
        slidesPerView: 4
      },
      575: {
        slidesPerView: 3
      },
      425: {
        slidesPerView: 2
      },
      375: {
        slidesPerView: 1
      },
      320: {
        slidesPerView: 1
      }
    }
  };
  onFile(event:any) {
    let reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    this.file =<File>event.target.files[0];
    this.ownership = this.file.name
  }
  getCardChar(key: number,value: any){
    let plate_char = value.target.value;
    let trans_value:any;
    this.error_CarPlate = '';
    switch(key){
      case 1: 
        this.plates_chars.forEach((char: any) => {
          if(char.char == plate_char){
            this.error_CarPlate = '';
            return trans_value = char.trans;
          }else{
            this.error_CarPlate = 'حروف اللوحه يجب ان تكون ضمن هذه المجموعه [ا-ب-ح-د-ر-س-ص-ط-ع-ق-ك-ل-م-ن-ه-و-ى]';          
          }
        });
        this.myForm.get('plate_chars_en_filter_6')?.get('plate_chars_en_1')?.setValue(trans_value)
      break;
      case 2:
        this.plates_chars.forEach((char: any) => {
          if(char.char == plate_char){
            this.error_CarPlate = '';
            return trans_value = char.trans;
          }else{
            this.error_CarPlate = 'حروف اللوحه يجب ان تكون ضمن هذه المجموعه [أ-ب-ح-د-ر-س-ص-ط-ع-ق-ك-ل-م-ن-ه-و-ى]';
          }
        });
        this.myForm.get('plate_chars_en_filter_6')?.get('plate_chars_en_2')?.setValue(trans_value)
      break;
      case 3:
        this.plates_chars.forEach((char: any) => {
          if(char.char == plate_char){
            this.error_CarPlate = '';
            return trans_value = char.trans;
          }else{
            this.error_CarPlate = 'حروف اللوحه يجب ان تكون ضمن هذه المجموعه [أ-ب-ح-د-ر-س-ص-ط-ع-ق-ك-ل-م-ن-ه-و-ى]';
          }
        });
        this.myForm.get('plate_chars_en_filter_6')?.get('plate_chars_en_3')?.setValue(trans_value)
      break;
    }
  }
  convertNumbers(key: number,value: any){
    let plate_num = value.target.value;
    let trans_value:any;
    switch(key){
      case 1: 
        this.plates_numbers.forEach((char: any) => {
          if(char.char == plate_num){
            return trans_value = char.trans;
          }
        });
        this.myForm.get('plate_numbers_en_filter_6')?.get('plate_number_en_1')?.setValue(trans_value)
      break;
      case 2:
        this.plates_numbers.forEach((char: any) => {
          if(char.char == plate_num){
            return trans_value = char.trans;
          }
        });
        this.myForm.get('plate_numbers_en_filter_6')?.get('plate_number_en_2')?.setValue(trans_value)
      break;
      case 3:
        this.plates_numbers.forEach((char: any) => {
          if(char.char == plate_num){
            return trans_value = char.trans;
          }
        });
        this.myForm.get('plate_numbers_en_filter_6')?.get('plate_number_en_3')?.setValue(trans_value)
      break;
      case 4:
        this.plates_numbers.forEach((char: any) => {
          if(char.char == plate_num){
            return trans_value = char.trans;
          }
        });
        this.myForm.get('plate_numbers_en_filter_6')?.get('plate_number_en_4')?.setValue(trans_value)
      break;
    }  
  }
  getCategories(){
    this.categorySub = this.httpService.
    getProductsCategories().
    subscribe({
      next: (categoryList: APIResponse2<Category>)=>{ 
        this.categories = categoryList.data;
      },
      error: (err: HttpErrorResponse)=>{
        if(err.error.data){
          this.error = err.error.data;
        }else{
          this.error = err.statusText;
        }
        this.addFaild.show();
      }
    })
  }
  getCategoryFilter(event: any){
    this.categoryName = event.value;
    if(this.categoryName == 'car_plates'){
      this.defaultImage_add = false;
      // this.myForm = new FormGroup({
      //   agrement: new FormControl('', [Validators.required]),
      //   seller_phone: new FormControl(''),
      //   productCategory: new FormControl('car_plates', [Validators.required]),
      //   name: new FormControl('', [Validators.required]),
      //   price: new FormControl('', [Validators.required]),
      //   desc: new FormControl('', [Validators.required]),
      //   owner_id: new FormControl(this.ownerId),
      //   negotiable: new FormControl(''),
      //   category_id: new FormControl(''),
      //   region_id: new FormControl('', [Validators.required]),
      //   plate_chars_filter_6: new FormGroup({
      //     plate_chars_ar_1: new FormControl(''),
      //     plate_chars_ar_2: new FormControl(''),
      //     plate_chars_ar_3: new FormControl(''),
      //   }),
      //   plate_chars_en_filter_6: new FormGroup({
      //     plate_chars_en_1: new FormControl(''),
      //     plate_chars_en_2: new FormControl(''),
      //     plate_chars_en_3: new FormControl(''),
      //   }),
      //   plate_numbers_filter_6: new FormGroup({
      //     plate_number_ar_1: new FormControl(''),
      //     plate_number_ar_2: new FormControl(''),
      //     plate_number_ar_3: new FormControl(''),
      //     plate_number_ar_4: new FormControl('')
      //   }),
      //   plate_numbers_en_filter_6: new FormGroup({
      //     plate_number_en_1: new FormControl(''),
      //     plate_number_en_2: new FormControl(''),
      //     plate_number_en_3: new FormControl(''),
      //     plate_number_en_4: new FormControl('')
      //   })
      // })
    }
    else{
      this.defaultImage_add = true;
      // this.myForm = new FormGroup({
      //   agrement: new FormControl('', [Validators.required]),
      //   seller_phone: new FormControl(''),
      //   productCategory: new FormControl('cars', [Validators.required]),
      //   name: new FormControl('', [Validators.required]),
      //   price: new FormControl('', [Validators.required]),
      //   desc: new FormControl('', [Validators.required]),
      //   owner_id: new FormControl(this.ownerId),
      //   negotiable: new FormControl(''),
      //   category_id: new FormControl(''),
      //   region_id: new FormControl('', [Validators.required]),
      //   product_image_1: new FormControl(''),
      //   product_image_2: new FormControl(''),
      //   product_image_3: new FormControl(''),
      //   product_image_4: new FormControl(''),
      //   product_image_5: new FormControl(''),
      //   product_image_6: new FormControl(''),
      //   product_image_7: new FormControl(''),
      //   plate_chars_filter_6: new FormGroup({
      //     plate_chars_ar_1: new FormControl(''),
      //     plate_chars_ar_2: new FormControl(''),
      //     plate_chars_ar_3: new FormControl(''),
      //   }),
      //   plate_chars_en_filter_6: new FormGroup({
      //     plate_chars_en_1: new FormControl(''),
      //     plate_chars_en_2: new FormControl(''),
      //     plate_chars_en_3: new FormControl(''),
      //   }),
      //   plate_numbers_filter_6: new FormGroup({
      //     plate_number_ar_1: new FormControl(''),
      //     plate_number_ar_2: new FormControl(''),
      //     plate_number_ar_3: new FormControl(''),
      //     plate_number_ar_4: new FormControl('')
      //   }),
      //   plate_numbers_en_filter_6: new FormGroup({
      //     plate_number_en_1: new FormControl(''),
      //     plate_number_en_2: new FormControl(''),
      //     plate_number_en_3: new FormControl(''),
      //     plate_number_en_4: new FormControl('')
      //   })
      // })
    }
    this.categories.forEach(ele=>{
      if(ele.slug == this.categoryName){
        this.catergoryId = ele.id;
        this.myForm.get('category_id')?.patchValue(ele.id)
      }
    })
    this.filterSub = this.httpService.getCategoryFilters(this.categoryName).subscribe({
      next: (res: CategoryFilter)=>{
        this.filters = res;                               
        this.filters.data.filters.forEach(filter=>{
          this.newFormControl = filter.slug_name;
          this.myForm.addControl(filter.slug_name, new FormControl('')) 
          this.filtersArr.push(this.newFormControl)
        })                
      },
      error: (err: HttpErrorResponse)=>{
        if(err.error.data){
          this.error = err.error.data;
        }else{
          this.error = err.statusText;
        }
        this.addFaild.show();
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
              this.filterSub = this.productsService.applayBarndFilter(sub_filter.id).subscribe({
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
  submit(){  
    this.submitted = true;  
    let plate_chars_en_filter_6: any, 
    plate_chars_filter_6: any,
    plate_number_en_filter_6_value: any,
    plate_number_filter_6_value: any;
    if(this.myForm.get('productCategory')?.value == 'car_plates'){
      plate_chars_en_filter_6 = Object.values(this.myForm.get('plate_chars_en_filter_6')?.value).join(' ');
      plate_chars_filter_6 = Object.values(this.myForm.get('plate_chars_filter_6')?.value).join(' ')
      plate_number_en_filter_6_value = Object.values(this.myForm.get('plate_numbers_en_filter_6')?.value).join(' ');
      plate_number_filter_6_value = Object.values(this.myForm.get('plate_numbers_filter_6')?.value).join(' ')
    }
    if(this.myForm.get('agrement')?.invalid){
      return;
    }else{      
        if(this.step == 1){
          this.step = this.step + 1;
        }
      if(this.myForm.valid){
        const formData = new FormData();
        for (const field in this.myForm.controls) {
            if(field == 'plate_chars_en_filter_6'){
              formData.append(field, plate_chars_en_filter_6);
            }else if(field == 'plate_chars_filter_6'){
              formData.append(field, plate_chars_filter_6);
            }
            else if(field == 'plate_numbers_en_filter_6'){
              formData.append(field, plate_number_en_filter_6_value);
            }else if(field == 'plate_numbers_filter_6'){
              formData.append(field, plate_number_filter_6_value);
            }
            else{
              formData.append(field, this.myForm.controls[field].value);
            }
            console.log(field,this.myForm.controls[field].value);
            
          }
          this.load = true;
          this.sendSub = this.httpService.http.post<NewProduct>(`${env.api_url}/products/store-new-product`,
            formData,
          this.httpService.httpOptions)
          .subscribe({
            next: (res: NewProduct)=>{
              this.load = false;
              this.errorAdd = ''
              this.NewProductRes = res;
              this.modelSuccessNewProduct.show();
            },
            error: ()=>{
              this.load = false;              
            }
          })   
        } 
        else{
          return;
        }
    }
  }
  close(){
    this.modelSuccessNewProduct.hide();
    setTimeout(()=>{
      this.router.navigate([`/adds/${this.ownerId}`])
    },500) 
  }
  getProductCategoryId(){
    const productCategory = this.myForm.get('productCategory')?.value;
    this.categories.forEach(ele=>{
      if(productCategory == ele.slug){
        this.catergoryId = ele.id;
      }
    })
  }
  getRegions(){
    this.filterSub = this.actionService.getRegions().subscribe({
      next: (res: Regions) => {
        this.regions = res.data        
      }
    })
  }
  openImgDialog(){
    this.modelAddImages.show();
  }
  ngOnDestory() :void{
    if(this.categorySub){
      this.categorySub.unsubscribe();
    } 
    if(this.filterSub){
      this.filterSub.unsubscribe();
    } 
    if(this.sendSub){
      this.sendSub.unsubscribe();
    } 
    
  }
}