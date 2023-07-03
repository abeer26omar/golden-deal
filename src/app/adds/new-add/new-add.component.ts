import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, from } from 'rxjs';
import { APIResponse2, Category, CategoryFilter, NewProduct} from '../../models/products.model';
import { ProductsRequestService } from 'src/app/services/products-request.service';
import { HttpErrorResponse } from '@angular/common/http';
import { environment as env } from 'src/environments/environment';
import { MacPrefixService } from 'src/app/services/mac-prefix.service';
import { ActionsService } from 'src/app/services/actions.service';
import { Regions } from 'src/app/models/actions.model';
import { SwiperOptions } from 'swiper';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';

declare var window: any;

@Component({
  selector: 'app-new-add',
  templateUrl: './new-add.component.html',
  styleUrls: ['./new-add.component.css']
})
export class NewAddComponent implements OnInit, OnDestroy {
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
  error_CarPlate_num: string = '';
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
  negotiable: number = 0;
  onAddNewImg1: boolean = false;
  onAddNewImg2: boolean = false;
  onAddNewImg3: boolean = false;
  onAddNewImg4: boolean = false;
  onAddNewImg5: boolean = false;
  onAddNewImg6: boolean = false;
  onAddNewImg7: boolean = false;
  card_chars_ar_1: string = '';
  card_chars_ar_2: string = '';
  card_chars_ar_3: string = '';
  card_chars_en_1: string = '';
  card_chars_en_2: string = '';
  card_chars_en_3: string = '';
  card_num_ar_1: string = '';
  card_num_ar_2: string = '';
  card_num_ar_3: string = '';
  card_num_ar_4: string = '';
  card_num_en_1: string = '';
  card_num_en_2: string = '';
  card_num_en_3: string = '';
  card_num_en_4: string = '';
  newFormControl!: any;
  plate_chars_filter_6: any;
  plate_chars_en_filter_6: any;
  plate_numbers_filter_6: any;
  plate_numbers_en_filter_6: any;
  input_number: any = [];
  regions: any = [];
  car_plate: string = '';
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
  ownerId: any = localStorage.getItem('userId');
  region_id: any = localStorage.getItem('region_id');
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
    { char: 'ه' , trans: 'H' },
    { char: 'و' , trans: 'U' },
    { char: 'ى' , trans: 'V' }
  ]
  plates_numbers: any = [
    { char: '٠' , trans: '0' },
    { char: '١' , trans: '1' },
    { char: '٢' , trans: '2' },
    { char: '٣' , trans: '3' },
    { char: '٤' , trans: '4' },
    { char: '٥' , trans: '5' },
    { char: '٦' , trans: '6' },
    { char: '٧' , trans: '7' },
    { char: '٨' , trans: '8' },
    { char: '٩' , trans: '9' },
  ]
  filterbrandsOptions :any= [];
  private categorySub : Subscription = new Subscription;
  private filterSub : Subscription = new Subscription;
  private sendSub: Subscription = new Subscription;
  constructor(private httpService: ProductsRequestService,
    private router: Router,
    private macService: MacPrefixService,
    private actionService: ActionsService,
    private productsService: ProductsRequestService,
    private errorHandel: ErrorHandlerService ) {}
    
    myForm = new FormGroup({
      agrement: new FormControl('', [Validators.required]),
      seller_phone: new FormControl(''),
      productCategory: new FormControl('', [Validators.required]),
      name: new FormControl(''),
      price: new FormControl('0', [Validators.required]),
      desc: new FormControl('', [Validators.required]),
      owner_id: new FormControl(this.ownerId),
      negotiable: new FormControl(''),
      category_id: new FormControl(''),
      region_id: new FormControl(this.region_id),
      product_image_1: new FormControl(''),
      product_image_2: new FormControl(''),
      product_image_3: new FormControl(''),
      product_image_4: new FormControl(''),
      product_image_5: new FormControl(''),
      product_image_6: new FormControl(''),
      product_image_7: new FormControl(''),
      plate_chars_filter_6: new FormGroup({
        plate_chars_ar_1: new FormControl(''),
        plate_chars_ar_2: new FormControl(''),
        plate_chars_ar_3: new FormControl(''),
      }),
      plate_chars_en_filter_6: new FormGroup({
        plate_chars_en_3: new FormControl(''),
        plate_chars_en_2: new FormControl(''),
        plate_chars_en_1: new FormControl(''),
      }),
      plate_numbers_filter_6: new FormGroup({
        plate_number_ar_1: new FormControl(''),
        plate_number_ar_2: new FormControl(''),
        plate_number_ar_3: new FormControl(''),
        plate_number_ar_4: new FormControl('')
      }),
      plate_numbers_en_filter_6: new FormGroup({
        plate_number_en_4: new FormControl(''),
        plate_number_en_3: new FormControl(''),
        plate_number_en_2: new FormControl(''),
        plate_number_en_1: new FormControl('')
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
      this.ownerId = localStorage.getItem('userId');
      this.region_id = localStorage.getItem('region_id');
  }
  onNegotiable(){
    if(this.negotiable == 0){
      this.negotiable = 1;
      this.f['negotiable'].setValue('1')
      this.f['price'].disable()
      this.f['price'].setValue('0')
    }else{
      this.negotiable = 0;
      this.f['negotiable'].setValue('0')
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
        this.onAddNewImg1 = true;
        reader.onload = ()=>{
          this.imgSrc1 = reader.result;
        }
        this.myForm.get('product_image_1')?.patchValue(this.file,this.file.name);
        break;
      case 2:
        this.onAddNewImg2 = true;
        reader.onload = ()=>{
          this.imgSrc2 = reader.result;
        }
        this.myForm.get('product_image_2')?.patchValue(this.file,this.file.name);
      break;
      case 3:
        this.onAddNewImg3 = true;
        reader.onload = ()=>{
          this.imgSrc3 = reader.result;
        }
        this.myForm.get('product_image_3')?.patchValue(this.file,this.file.name);
      break;
      case 4:
        this.onAddNewImg4 = true;
        reader.onload = ()=>{
          this.imgSrc4 = reader.result;
        }
        this.myForm.get('product_image_4')?.patchValue(this.file,this.file.name);
      break;
      case 5:
        this.onAddNewImg5 = true;
        reader.onload = ()=>{
          this.imgSrc5 = reader.result;
        }
        this.myForm.get('product_image_5')?.patchValue(this.file,this.file.name);
      break;
      case 6:
        this.onAddNewImg6 = true;
        reader.onload = ()=>{
          this.imgSrc6 = reader.result;
        }
        this.myForm.get('product_image_6')?.patchValue(this.file,this.file.name);
      break;
      case 7:
        this.onAddNewImg7 = true;
        reader.onload = ()=>{
          this.imgSrc7 = reader.result;
        }
        this.myForm.get('product_image_7')?.patchValue(this.file,this.file.name);
      break;
    }
  }
  resetImg(key: any){
    switch(key){
      case 1:
        this.onAddNewImg1 = false;
        this.imgSrc1 = ''  
        this.myForm.get('product_image_1')?.setValue('');
      break;
      case 2:
        this.onAddNewImg2 = false;
        this.imgSrc2 = ''  
        this.myForm.get('product_image_2')?.setValue('');
      break;
      case 3:
        this.onAddNewImg3 = false;
        this.imgSrc3 = ''  
        this.myForm.get('product_image_3')?.setValue('');
      break;
      case 4:
        this.onAddNewImg4 = false;
        this.imgSrc4 = ''  
        this.myForm.get('product_image_4')?.setValue('');
      break;
      case 5:
        this.onAddNewImg5 = false;
        this.imgSrc5 = ''  
        this.myForm.get('product_image_5')?.setValue('');
      break;
      case 6:
        this.onAddNewImg6 = false;
        this.imgSrc6 = ''  
        this.myForm.get('product_image_6')?.setValue('');
      break;
      case 7:
        this.onAddNewImg7 = false;
        this.imgSrc7 = ''  
        this.myForm.get('product_image_7')?.setValue('');
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
    let trans_value: any;
    this.error_CarPlate = '';
    let foundChar = false;
    switch(key){
      case 1: 
        this.card_chars_ar_1 = '';
        this.card_chars_en_1 = '';
        this.plates_chars.forEach((char: any) => {
          if(char.char == plate_char){
            foundChar = true;
            this.card_chars_ar_1 = plate_char;
            this.card_chars_en_1 = char.trans;
            return trans_value = char.trans;
          }
          if(!foundChar){
            this.error_CarPlate = 'حروف اللوحه يجب ان تكون ضمن هذه المجموعه [ا-ب-ح-د-ر-س-ص-ط-ع-ق-ك-ل-م-ن-ه-و-ى]';          
          }else{
            this.error_CarPlate = '';
          }
        });
        this.myForm.get('plate_chars_en_filter_6')?.get('plate_chars_en_1')?.setValue(trans_value)
      break;
      case 2:
        this.card_chars_ar_2 = '';
        this.card_chars_en_2 = '';
        this.plates_chars.forEach((char: any) => {
          if(char.char == plate_char){
            foundChar = true;
            this.card_chars_ar_2 = plate_char;
            this.card_chars_en_2 = char.trans;
            return trans_value = char.trans;
          }
          if(!foundChar){
            this.error_CarPlate = 'حروف اللوحه يجب ان تكون ضمن هذه المجموعه [ا-ب-ح-د-ر-س-ص-ط-ع-ق-ك-ل-م-ن-ه-و-ى]';          
          }else{
            this.error_CarPlate = '';
          }
        });
        this.myForm.get('plate_chars_en_filter_6')?.get('plate_chars_en_2')?.setValue(trans_value)
      break;
      case 3:
        this.card_chars_ar_3 = '';
        this.card_chars_en_3 = '';
        this.plates_chars.forEach((char: any) => {
          if(char.char == plate_char){
            foundChar = true;
            this.card_chars_ar_3 = plate_char;
            this.card_chars_en_3 = char.trans;
            return trans_value = char.trans;
          }
          if(!foundChar){
            this.error_CarPlate = 'حروف اللوحه يجب ان تكون ضمن هذه المجموعه [ا-ب-ح-د-ر-س-ص-ط-ع-ق-ك-ل-م-ن-ه-و-ى]';          
          }else{
            this.error_CarPlate = '';
          }
        });
        this.myForm.get('plate_chars_en_filter_6')?.get('plate_chars_en_3')?.setValue(trans_value)
      break;
    }
  }
  convertNumbers(key: number,value: any){
    let plate_num = value.target.value;
    let foundChar = false;
    let trans_value: any;
    switch(key){
      case 1: 
          this.card_num_ar_1 = '';
          this.card_num_en_1 = '';
          this.plates_numbers.forEach((char: any) => {
            if(char.char == plate_num){
                foundChar = true;
                this.card_num_ar_1 = char.char;
                this.card_num_en_1 = char.trans;
                this.myForm.get('plate_numbers_en_filter_6')?.get('plate_number_en_1')?.setValue(char.trans);
            }else if(char.trans == plate_num){
              foundChar = true;
              this.card_num_ar_1 = char.char;
              this.card_num_en_1 = char.trans;
              this.myForm.get('plate_numbers_filter_6')?.get('plate_number_ar_1')?.setValue(char.char);
              this.myForm.get('plate_numbers_en_filter_6')?.get('plate_number_en_1')?.setValue(char.trans); 
            }else if(plate_num == ''){
              this.myForm.get('plate_numbers_en_filter_6')?.get('plate_number_en_1')?.setValue('');
            }
          });
            if(!foundChar){
              this.error_CarPlate_num = 'ارقام اللوحه يجب ان تكون ضمن هذه المجموعه [٠-١-٢-٣-٤-٥-٦-٧-٨-٩] او هذه المجموعه [1-2-3-4-5-6-7-8-9]';  
            }else{
              this.error_CarPlate_num = '';
            }
      break;
      case 2:
        this.card_num_ar_2 = '';
        this.card_num_en_2 = '';
        this.plates_numbers.forEach((char: any) => {
          if(char.char == plate_num){
              foundChar = true;
              this.card_num_ar_2 = char.char;
              this.card_num_en_2 = char.trans;
              this.myForm.get('plate_numbers_en_filter_6')?.get('plate_number_en_2')?.setValue(char.trans);
          }else if(char.trans == plate_num){
            foundChar = true;
            this.card_num_ar_2 = char.char;
            this.card_num_en_2 = char.trans;
            this.myForm.get('plate_numbers_filter_6')?.get('plate_number_ar_2')?.setValue(char.char);
            this.myForm.get('plate_numbers_en_filter_6')?.get('plate_number_en_2')?.setValue(char.trans); 
          }else if(plate_num == ''){
            this.myForm.get('plate_numbers_en_filter_6')?.get('plate_number_en_2')?.setValue(''); 
          }
        });
        if(!foundChar){
          this.error_CarPlate_num = 'ارقام اللوحه يجب ان تكون ضمن هذه المجموعه [٠-١-٢-٣-٤-٥-٦-٧-٨-٩] او هذه المجموعه [1-2-3-4-5-6-7-8-9]';  
        }else{
          this.error_CarPlate_num = '';
        }
      break;
      case 3:
        this.card_num_ar_3 = '';
        this.card_num_en_3 = '';
        this.plates_numbers.forEach((char: any) => {
          if(char.char == plate_num){
              foundChar = true;
              this.card_num_ar_3 = char.char;
              this.card_num_en_3 = char.trans;
              this.myForm.get('plate_numbers_en_filter_6')?.get('plate_number_en_3')?.setValue(char.trans);
          }else if(char.trans == plate_num){
            foundChar = true;
            this.card_num_ar_3 = char.char;
            this.card_num_en_3 = char.trans;
            this.myForm.get('plate_numbers_filter_6')?.get('plate_number_ar_3')?.setValue(char.char);
            this.myForm.get('plate_numbers_en_filter_6')?.get('plate_number_en_3')?.setValue(char.trans); 
          }else if(plate_num == ''){
            this.myForm.get('plate_numbers_en_filter_6')?.get('plate_number_en_3')?.setValue(''); 
          }
        });
        if(!foundChar){
          this.error_CarPlate_num = 'ارقام اللوحه يجب ان تكون ضمن هذه المجموعه [٠-١-٢-٣-٤-٥-٦-٧-٨-٩] او هذه المجموعه [1-2-3-4-5-6-7-8-9]';  
        }else{
          this.error_CarPlate_num = '';
        }
      break;
      case 4:
        this.card_num_ar_4 = '';
        this.card_num_en_4 = '';
        this.plates_numbers.forEach((char: any) => {
          if(char.char == plate_num){
              foundChar = true;
              this.card_num_ar_4 = char.char;
              this.card_num_en_4 = char.trans;
              this.myForm.get('plate_numbers_en_filter_6')?.get('plate_number_en_4')?.setValue(char.trans);
          }else if(char.trans == plate_num){
            foundChar = true;
            this.card_num_ar_4 = char.char;
            this.card_num_en_4 = char.trans;
            this.myForm.get('plate_numbers_filter_6')?.get('plate_number_ar_4')?.setValue(char.char);
            this.myForm.get('plate_numbers_en_filter_6')?.get('plate_number_en_4')?.setValue(char.trans); 
          }else if(plate_num == ''){
            this.myForm.get('plate_numbers_en_filter_6')?.get('plate_number_en_4')?.setValue(''); 
          }
        });
          if(!foundChar){
            this.error_CarPlate_num = 'ارقام اللوحه يجب ان تكون ضمن هذه المجموعه [٠-١-٢-٣-٤-٥-٦-٧-٨-٩] او هذه المجموعه [1-2-3-4-5-6-7-8-9]';  
          }else{
            this.error_CarPlate_num = '';
          }
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
      this.myForm.get('plate_chars_filter_6')?.get('plate_chars_ar_1')?.setValidators([Validators.required,Validators.maxLength(1),Validators.pattern(/^[\u0627-\u0628\u062d\u062f\u0631\u0633\u0635\u0637\u0639\u0642\u0643\u0644\u0645\u0646\u0647\u0648\u0649]+$/)]);
      this.myForm.get('plate_chars_filter_6')?.get('plate_chars_ar_2')?.setValidators([Validators.maxLength(1),Validators.pattern(/^[\u0627-\u0628\u062d\u062f\u0631\u0633\u0635\u0637\u0639\u0642\u0643\u0644\u0645\u0646\u0647\u0648\u0649]+$/)]);
      this.myForm.get('plate_chars_filter_6')?.get('plate_chars_ar_3')?.setValidators([Validators.maxLength(1),Validators.pattern(/^[\u0627-\u0628\u062d\u062f\u0631\u0633\u0635\u0637\u0639\u0642\u0643\u0644\u0645\u0646\u0647\u0648\u0649]+$/)]);
      // this.myForm.get('plate_chars_en_filter_6')?.get('plate_chars_en_1')?.setValidators([Validators.required]);
      this.myForm.get('plate_numbers_filter_6')?.get('plate_number_ar_1')?.setValidators([Validators.maxLength(1),Validators.required]);
      this.myForm.get('plate_numbers_en_filter_6')?.get('plate_number_en_1')?.setValidators([Validators.maxLength(1),Validators.required]);
      // this.myForm.get('plate_numbers_filter_6')?.get('plate_number_ar_2')?.setValidators([Validators.maxLength(1)]);
      // this.myForm.get('plate_numbers_filter_6')?.get('plate_number_ar_3')?.setValidators([Validators.maxLength(1)]);
      // this.myForm.get('plate_numbers_filter_6')?.get('plate_number_ar_4')?.setValidators([Validators.maxLength(1)]);
      this.myForm.get('product_image_1')?.removeValidators([Validators.required]);
      this.myForm.get('product_image_2')?.removeValidators([Validators.required]);
      this.myForm.get('product_image_3')?.removeValidators([Validators.required]);
      this.myForm.get('product_image_4')?.removeValidators([Validators.required]);
      this.myForm.get('name')?.removeValidators([Validators.required])
    }
    else{
      this.defaultImage_add = true;
      this.myForm.get('plate_chars_filter_6')?.get('plate_chars_ar_1')?.removeValidators([Validators.required]);
      this.myForm.get('plate_chars_en_filter_6')?.get('plate_chars_en_1')?.removeValidators([Validators.required]);
      this.myForm.get('plate_numbers_filter_6')?.get('plate_number_ar_1')?.removeValidators([Validators.maxLength(1),Validators.required]);
      this.myForm.get('plate_numbers_en_filter_6')?.get('plate_number_en_1')?.removeValidators([Validators.required]);
      // this.myForm.get('plate_numbers_filter_6')?.get('plate_number_ar_2')?.removeValidators([Validators.maxLength(1)]);
      // this.myForm.get('plate_numbers_filter_6')?.get('plate_number_ar_3')?.removeValidators([Validators.maxLength(1)]);
      // this.myForm.get('plate_numbers_filter_6')?.get('plate_number_ar_4')?.removeValidators([Validators.maxLength(1)]);
      this.myForm.get('product_image_1')?.setValidators([Validators.required]);
      this.myForm.get('product_image_2')?.setValidators([Validators.required]);
      this.myForm.get('product_image_3')?.setValidators([Validators.required]);
      this.myForm.get('product_image_4')?.setValidators([Validators.required]);
      this.myForm.get('name')?.setValidators([Validators.required]);
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
                },
                error: (err: HttpErrorResponse)=>{
                  this.errorHandel.openErrorModa(err);
                }
              })       
            }
          })
        }
      })
    }
    if(filter_name == 'نوع اللوحة'){
      this.car_plate = event.target.value
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
      plate_number_filter_6_value = Object.values(this.myForm.get('plate_numbers_filter_6')?.value).join(' ');
      this.myForm.get('name')?.setValue(this.car_plate);
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
              this.RestFormForNewAdds();
            },
            error: (err: HttpErrorResponse)=>{
              this.load = false;
              this.errorHandel.openErrorModa(err);
            }
          })   
        } 
        else{
          return;
        }
    }
  }
  RestFormForNewAdds(){
    console.log(this.ownerId);
    console.log(this.region_id);
    this.myForm.reset();
    this.myForm.get('negotiable')?.setValue(0);
    this.myForm.get('price')?.setValue(0);
    this.myForm.get('owner_id')?.setValue(this.ownerId);
    this.myForm.get('region_id')?.setValue(this.region_id);
    this.card_chars_ar_1 = '';
    this.card_chars_ar_2 = '';
    this.card_chars_ar_3 = '';
    this.card_chars_en_1 = '';
    this.card_chars_en_2 = '';
    this.card_chars_en_3 = '';
    this.card_num_ar_1 = '';
    this.card_num_ar_2 = '';
    this.card_num_ar_3 = '';
    this.card_num_ar_4 = '';
    this.card_num_en_1 = '';
    this.card_num_en_2 = '';
    this.card_num_en_3 = '';
    this.card_num_en_4 = '';
  }
  close(){
    const modelSuccessNewProduct = document.getElementById('modelSuccessNewProduct');
    this.modelSuccessNewProduct.hide();
    modelSuccessNewProduct?.addEventListener('hidden.bs.modal', () => {
      this.step = 1;
    })
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
      },
      error: (err: HttpErrorResponse)=>{
        this.errorHandel.openErrorModa(err);
      }
    })
  }
  openImgDialog(){
    this.modelAddImages.show();
  }
  ngOnDestroy() :void{
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