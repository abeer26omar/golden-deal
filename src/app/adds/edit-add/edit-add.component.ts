import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { APIResponse2, APIResponse4, Category, EditProduct, EditProductFilters, Update } from 'src/app/models/products.model';
import { ProductsRequestService } from 'src/app/services/products-request.service';
import { MacPrefixService } from 'src/app/services/mac-prefix.service';
import { ActionsService } from 'src/app/services/actions.service';
import { Regions } from 'src/app/models/actions.model';
import { SwiperOptions } from 'swiper';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { MustMatchService } from 'src/app/services/must-match.service';
import { CookieService } from 'ngx-cookie-service';

declare var window: any;

@Component({
  selector: 'app-edit-add',
  templateUrl: './edit-add.component.html',
  styleUrls: ['./edit-add.component.css']
})
export class EditAddComponent implements OnInit, OnDestroy {
  images : string[] = [];
  addId!: number;
  addCategory: string = '';
  error: string = '';
  error_format: boolean = false;
  errorMsg: string = '';
  modelSuccessNewProduct: any;
  modelAddImages: any;
  addFaild: any;
  file!: File;
  load: boolean = false;
  negotiable: boolean = false;
  imgSrc1: any;
  imgSrc2: any;
  imgSrc3: any;
  imgSrc4: any;
  imgSrc5: any;
  imgSrc6: any;
  imgSrc7: any;
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
  error_CarPlate: string = '';
  error_CarPlate_num: string = '';
  rest_images: any = [];
  userId!: any;
  Add : EditProduct = {
    data: {
      id: 0,
        parent_id: null,
        name: '',
        desc: '',
        materials: '',
        about_seller: '',
        delivery_notes: '',
        owner_id: 0,
        category_id: 0,
        seller_phone: 0,
        region_id: 0,
        negotiable: 0,
        price: 0,
        status: '',
        active: 0,
        activated_since: 0,
        region_name: '',
        owner_area: '',
        sold_to: null,
        created_since: '',
        default_image: '',
        category_slug: '',
        ownership_image_url: '',
        product_images: [
            {
                id: 0,
                product_id: 0,
                image_key: '',
                image: '',
                image_url: ''
            }
        ],
        properties: []
    }
  };
  regions: any = [];
  myForm = new FormGroup({
    seller_phone: new FormControl(''),
    productCategory: new FormControl(''),
    name: new FormControl(''),
    price: new FormControl(''),
    desc: new FormControl(''),
    owner_id: new FormControl(''),
    category_id: new FormControl(''),
    region_id: new FormControl(''),
    negotiable: new FormControl(''),
    product_image_1: new FormControl(''),
    product_image_2: new FormControl(''),
    product_image_3: new FormControl(''),
    product_image_4: new FormControl(''),
    product_image_5: new FormControl(''),
    product_image_6: new FormControl(''),
    product_image_7: new FormControl(''),
    plate_chars_filter_6: new FormGroup({}),
    plate_chars_en_filter_6: new FormGroup({}),
    plate_numbers_filter_6: new FormGroup({}),
    plate_numbers_en_filter_6: new FormGroup({})
  });
  updateProduct: Update = {
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
  public categories : Array<Category> = [];
  public EditFilter: Array<EditProductFilters> = [];

  private editSub : Subscription = new Subscription;
  private routeSub: Subscription = new Subscription;
  private categorySub : Subscription = new Subscription;
  private filterSub : Subscription = new Subscription;

  mac: boolean = false;
  constructor(private productService: ProductsRequestService,
    private router: ActivatedRoute,
    private route: Router,
    private macService: MacPrefixService,
    private actionService: ActionsService,
    private errorHandel: ErrorHandlerService,
    private renderer: Renderer2, 
    private cookieService: CookieService) { }
  get f(){
    return this.myForm.controls;
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
  ngOnInit(): void {
    this.userId = localStorage.getItem('userId') || this.cookieService.get('userId');
    this.routeSub = this.router.params.subscribe((params: Params) => {
      this.addId = params['id'];
    })
    this.getAddInfo(this.addId);
    this.getCategories();
    this.getRegions();
    this.modelSuccessNewProduct = new window.bootstrap.Modal(
      document.getElementById('modelSuccessNewProduct'),{backdrop: this.macService.backdrop}
    );  
    this.modelAddImages = new window.bootstrap.Modal(
      document.getElementById('modelAddImages'),{backdrop: this.macService.backdrop}
    );
    this.addFaild = new window.bootstrap.Modal(
      document.getElementById('addFaild'),{backdrop: this.macService.backdrop}
    );
  }
  onFileChange(key: number,event: any){
    let reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    this.file =<File>event.target.files[0];
    switch(key){
      case 1:
        const fileFormat_1 = this.file.type.split('/')[1].toLowerCase();
          if (fileFormat_1 !== 'png' && fileFormat_1 !== 'jpeg' && fileFormat_1 !== 'jpg') {
            this.error_format = true;
            this.errorMsg = 'Supported Formats Only png/jpg/jpeg';
            event.target.value = null;
            this.myForm.get('product_image_1')?.patchValue('');
            return;
          }else{
            this.error_format = false;
            this.errorMsg = '';
            reader.onload = ()=>{
              this.imgSrc1 = reader.result;
              document.getElementById('imgSrc_1')?.setAttribute('src', this.imgSrc1)
            }
            this.myForm.get('product_image_1')?.patchValue(this.file,this.file.name);
        }
        break;
      case 2:
        const fileFormat_2 = this.file.type.split('/')[1].toLowerCase();
          if (fileFormat_2 !== 'png' && fileFormat_2 !== 'jpeg' && fileFormat_2 !== 'jpg') {
            this.error_format = true;
            this.errorMsg = 'Supported Formats Only png/jpg/jpeg';
            event.target.value = null;
            this.myForm.get('product_image_2')?.patchValue('');
            return;
          }else{
            this.error_format = false;
            this.errorMsg = '';
            reader.onload = ()=>{
              this.imgSrc2 = reader.result;
              document.getElementById('imgSrc_2')?.setAttribute('src', this.imgSrc2)
            }
            this.myForm.get('product_image_2')?.patchValue(this.file,this.file.name);
          }
      break;
      case 3:
        const fileFormat_3 = this.file.type.split('/')[1].toLowerCase();
          if (fileFormat_3 !== 'png' && fileFormat_3 !== 'jpeg' && fileFormat_3 !== 'jpg') {
            this.error_format = true;
            this.errorMsg = 'Supported Formats Only png/jpg/jpeg';
            event.target.value = null;
            this.myForm.get('product_image_3')?.patchValue('');
            return;
          }else{
            this.error_format = false;
            this.errorMsg = '';
            reader.onload = ()=>{
              this.imgSrc3 = reader.result;
              document.getElementById('imgSrc_3')?.setAttribute('src', this.imgSrc3)
            }
            this.myForm.get('product_image_3')?.patchValue(this.file,this.file.name);
          }
      break;
      case 4:
        const fileFormat_4 = this.file.type.split('/')[1].toLowerCase();
          if (fileFormat_4 !== 'png' && fileFormat_4 !== 'jpeg' && fileFormat_4 !== 'jpg') {
            this.error_format = true;
            this.errorMsg = 'Supported Formats Only png/jpg/jpeg';
            event.target.value = null;
            this.myForm.get('product_image_4')?.patchValue('');
            return;
          }else{
            this.error_format = false;
            this.errorMsg = '';
            reader.onload = ()=>{
              this.imgSrc4 = reader.result;
              document.getElementById('imgSrc_4')?.setAttribute('src', this.imgSrc4)
            }
            this.myForm.get('product_image_4')?.patchValue(this.file,this.file.name);
      }
      break;
      case 5:
        const fileFormat_5 = this.file.type.split('/')[1].toLowerCase();
          if (fileFormat_5 !== 'png' && fileFormat_5 !== 'jpeg' && fileFormat_5 !== 'jpg') {
            this.error_format = true;
            this.errorMsg = 'Supported Formats Only png/jpg/jpeg';
            event.target.value = null;
            this.myForm.get('product_image_5')?.patchValue('');
            return;
          }else{
            this.error_format = false;
            this.errorMsg = '';
            reader.onload = ()=>{
              this.imgSrc5 = reader.result;
              document.getElementById('imgSrc_5')?.setAttribute('src', this.imgSrc5)
            }
            this.myForm.get('product_image_5')?.patchValue(this.file,this.file.name);
          }
      break;
      case 6:
        const fileFormat_6 = this.file.type.split('/')[1].toLowerCase();
          if (fileFormat_6 !== 'png' && fileFormat_6 !== 'jpeg' && fileFormat_6 !== 'jpg') {
            this.error_format = true;
            this.errorMsg = 'Supported Formats Only png/jpg/jpeg';
            event.target.value = null;
            this.myForm.get('product_image_6')?.patchValue('');
            return;
          }else{
            this.error_format = false;
            this.errorMsg = '';
            reader.onload = ()=>{
              this.imgSrc6 = reader.result;
              document.getElementById('imgSrc_6')?.setAttribute('src', this.imgSrc5)
            }
            this.myForm.get('product_image_6')?.patchValue(this.file,this.file.name);
      }
      break;
      case 7:
        const fileFormat_7 = this.file.type.split('/')[1].toLowerCase();
          if (fileFormat_7 !== 'png' && fileFormat_7 !== 'jpeg' && fileFormat_7 !== 'jpg') {
            this.error_format = true;
            this.errorMsg = 'Supported Formats Only png/jpg/jpeg';
            event.target.value = null;
            this.myForm.get('product_image_7')?.patchValue('');
            return;
          }else{
            this.error_format = false;
            this.errorMsg = '';
        reader.onload = ()=>{
          this.imgSrc7 = reader.result;
          document.getElementById('imgSrc_7')?.setAttribute('src', this.imgSrc5)
        }
        this.myForm.get('product_image_7')?.patchValue(this.file,this.file.name);
      }
      break;
    }
  }
  resetImg(key: any){
    switch(key){
      case 1:
        this.onAddNewImg1 = true;
        document.getElementById('imgSrc_1')?.setAttribute('src', '../../../assets/images/add_new_icon.svg');
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
  getCategories(){
    this.categorySub = this.productService.
    getProductsCategories().
    subscribe({
      next: (categoryList: APIResponse2<Category>)=>{ 
        this.categories = categoryList.data;
      }
    })
  }
  getAddInfo(id: number){
    this.editSub = this.productService.getEditAddInfo(id).subscribe({
      next: (res: EditProduct)=>{
        this.Add = res;
        if(this.Add.data.negotiable == 1){
          this.negotiable = true;
        }        
        this.addCategory = this.Add.data.category_slug;
        this.Add.data.product_images.forEach(ele=>{
         this.images.push(ele.image_url);
         this.onAddNewImg1 = true;
        })
        for(let i=7; i > this.Add.data.product_images.length; i--){
          this.rest_images.push(i)
          }
          if(this.Add.data.category_slug == 'car_plates'){
            this.myForm = new FormGroup({
              seller_phone: new FormControl(this.Add.data.seller_phone),
              productCategory: new FormControl(this.Add.data.category_slug),
              name: new FormControl(this.Add.data.name),
              price: new FormControl(this.Add.data.price),
              desc: new FormControl(this.Add.data.desc),
              owner_id: new FormControl(this.Add.data.owner_id),
              category_id: new FormControl(this.Add.data.category_id),
              region_id: new FormControl(this.Add.data.region_id),
              negotiable: new FormControl(this.Add.data.negotiable),
              plate_chars_filter_6: new FormGroup({}),
              plate_chars_en_filter_6: new FormGroup({}),
              plate_numbers_filter_6: new FormGroup({}),
              plate_numbers_en_filter_6: new FormGroup({})
            });
          }else{
            this.myForm = new FormGroup({
              seller_phone: new FormControl(this.Add.data.seller_phone),
              productCategory: new FormControl(this.Add.data.category_slug),
              name: new FormControl(this.Add.data.name),
              price: new FormControl(this.Add.data.price),
              desc: new FormControl(this.Add.data.desc),
              owner_id: new FormControl(this.Add.data.owner_id),
              category_id: new FormControl(this.Add.data.category_id),
              region_id: new FormControl(this.Add.data.region_id),
              negotiable: new FormControl(this.Add.data.negotiable),
              product_image_1: new FormControl(''),
              product_image_2: new FormControl(''),
              product_image_3: new FormControl(''),
              product_image_4: new FormControl(''),
              product_image_5: new FormControl(''),
              product_image_6: new FormControl(''),
              product_image_7: new FormControl(''),
            });
          }
        this.getAddFilters();
      },
      error: (err: HttpErrorResponse)=>{
        this.errorHandel.openErrorModa(err);
      }
    })
  }
  getAddFilters(){
    this.editSub = this.productService.getEditFilters(this.addId,this.addCategory).subscribe({
      next: (res: APIResponse4<EditProductFilters>)=>{
        this.EditFilter = res.data;
        
        this.EditFilter.forEach(ele=>{    
          if(ele.filter_value !== null){
            if(ele.slug_name == 'plate_chars_filter_6'){
              console.log(ele.filter_value.filter_value);
              this.card_chars_ar_1 = ele.filter_value.filter_value[0];
              this.card_chars_ar_2 = ele.filter_value.filter_value[2];
              this.card_chars_ar_3 = ele.filter_value.filter_value[4];
              let plate_chars_filter_6 = this.myForm.get('plate_chars_filter_6') as FormGroup;
              plate_chars_filter_6.addControl('plate_chars_ar_1', new FormControl(ele.filter_value.filter_value[0],[Validators.required,Validators.pattern(/^[\u0627-\u0628\u062d\u062f\u0631\u0633\u0635\u0637\u0639\u0642\u0643\u0644\u0645\u0646\u0647\u0648\u0649]+$/),Validators.maxLength(1)]));
              plate_chars_filter_6.addControl('plate_chars_ar_2', new FormControl(ele.filter_value.filter_value[2],[Validators.pattern(/^[\u0627-\u0628\u062d\u062f\u0631\u0633\u0635\u0637\u0639\u0642\u0643\u0644\u0645\u0646\u0647\u0648\u0649]+$/),Validators.maxLength(1)]));
              plate_chars_filter_6.addControl('plate_chars_ar_3', new FormControl(ele.filter_value.filter_value[4],[Validators.pattern(/^[\u0627-\u0628\u062d\u062f\u0631\u0633\u0635\u0637\u0639\u0642\u0643\u0644\u0645\u0646\u0647\u0648\u0649]+$/),Validators.maxLength(1)]));
            }else if(ele.slug_name == 'plate_chars_en_filter_6'){
              console.log(ele.filter_value.filter_value);

              this.card_chars_en_3 = ele.filter_value.filter_value[0];
              this.card_chars_en_2 = ele.filter_value.filter_value[2];
              this.card_chars_en_1 = ele.filter_value.filter_value[4];

              let plate_chars_en_filter_6 = this.myForm.get('plate_chars_en_filter_6') as FormGroup  
              plate_chars_en_filter_6.addControl('plate_chars_en_1', new FormControl(ele.filter_value.filter_value[0]));
              plate_chars_en_filter_6.addControl('plate_chars_en_2', new FormControl(ele.filter_value.filter_value[2]));
              plate_chars_en_filter_6.addControl('plate_chars_en_3', new FormControl(ele.filter_value.filter_value[4]));              
            }else if(ele.slug_name == 'plate_numbers_filter_6'){
              this.card_num_ar_1 = ele.filter_value.filter_value[0];
              this.card_num_ar_2 = ele.filter_value.filter_value[2];
              this.card_num_ar_3 = ele.filter_value.filter_value[4];
              this.card_num_ar_4 = ele.filter_value.filter_value[6];

              let plate_numbers_filter_6 = this.myForm.get('plate_numbers_filter_6') as FormGroup;
              plate_numbers_filter_6.addControl('plate_number_ar_1', new FormControl(ele.filter_value.filter_value[0],[Validators.required,Validators.pattern(/^[\u0660-\u0669]/)]));
              plate_numbers_filter_6.addControl('plate_number_ar_2', new FormControl(ele.filter_value.filter_value[2],[Validators.pattern(/^[\u0660-\u0669]/),Validators.maxLength(1)]));
              plate_numbers_filter_6.addControl('plate_number_ar_3', new FormControl(ele.filter_value.filter_value[4],[Validators.pattern(/^[\u0660-\u0669]/),Validators.maxLength(1)]));
              plate_numbers_filter_6.addControl('plate_number_ar_4', new FormControl(ele.filter_value.filter_value[6],[Validators.pattern(/^[\u0660-\u0669]/),Validators.maxLength(1)]));

            }else if(ele.slug_name == 'plate_numbers_en_filter_6'){
              const reversedValue = ele.filter_value.filter_value.split('').reverse().join('');

              this.card_num_en_1 = reversedValue[0];
              this.card_num_en_2 = reversedValue[2];
              this.card_num_en_3 = reversedValue[4];
              this.card_num_en_4 = reversedValue[6];

              let plate_numbers_en_filter_6 = this.myForm.get('plate_numbers_en_filter_6') as FormGroup;
              plate_numbers_en_filter_6.addControl('plate_number_en_1', new FormControl(reversedValue[0]));
              plate_numbers_en_filter_6.addControl('plate_number_en_2', new FormControl(reversedValue[2]));
              plate_numbers_en_filter_6.addControl('plate_number_en_3', new FormControl(reversedValue[4]));
              plate_numbers_en_filter_6.addControl('plate_number_en_4', new FormControl(reversedValue[6]));
            }
            else{
              this.myForm.addControl(ele.slug_name,new FormControl(ele.filter_value.filter_value))
            }
          }else{ 
            this.myForm.addControl(ele.slug_name,new FormControl(''))
          }
        })
      },
      error: (err: HttpErrorResponse)=>{
        this.errorHandel.openErrorModa(err);
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
    this.error_CarPlate_num = '';
    // let trans_value: any;
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
                this.myForm.get('plate_numbers_filter_6')?.get('plate_number_ar_1')?.setValue(char.char);
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
              this.error_CarPlate_num = 'ارقام اللوحه يجب ان تكون ضمن هذه المجموعه [٠-١-٢-٣-٤-٥-٦-٧-٨-٩] او هذه المجموعه [0-1-2-3-4-5-6-7-8-9]';  
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
              this.myForm.get('plate_numbers_filter_6')?.get('plate_number_ar_2')?.setValue(char.char);
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
          this.error_CarPlate_num = 'ارقام اللوحه يجب ان تكون ضمن هذه المجموعه [٠-١-٢-٣-٤-٥-٦-٧-٨-٩] او هذه المجموعه [0-1-2-3-4-5-6-7-8-9]';  
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
              this.myForm.get('plate_numbers_filter_6')?.get('plate_number_ar_3')?.setValue(char.char);
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
          this.error_CarPlate_num = 'ارقام اللوحه يجب ان تكون ضمن هذه المجموعه [٠-١-٢-٣-٤-٥-٦-٧-٨-٩] او هذه المجموعه [0-1-2-3-4-5-6-7-8-9]';  
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
              this.myForm.get('plate_numbers_filter_6')?.get('plate_number_ar_4')?.setValue(char.char);
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
            this.error_CarPlate_num = 'ارقام اللوحه يجب ان تكون ضمن هذه المجموعه [٠-١-٢-٣-٤-٥-٦-٧-٨-٩] او هذه المجموعه [0-1-2-3-4-5-6-7-8-9]';  
          }else{
            this.error_CarPlate_num = '';
          }
      break;
    }  
  }
  openImgDialog(){
    this.modelAddImages.show();
  }
  submit(){
    let plate_chars_en_filter_6: any, 
    plate_chars_filter_6: any,
    plate_number_en_filter_6_value: any,
    plate_number_filter_6_value: any;
    if(this.myForm.get('productCategory')?.value == 'car_plates'){
      plate_chars_en_filter_6 = Object.values(this.myForm.get('plate_chars_en_filter_6')?.value).join(' ');
      plate_chars_filter_6 = Object.values(this.myForm.get('plate_chars_filter_6')?.value).join(' ')
      plate_number_en_filter_6_value = Object.values(this.myForm.get('plate_numbers_en_filter_6')?.value).join(' ');
      plate_number_filter_6_value = Object.values(this.myForm.get('plate_numbers_filter_6')?.value).join(' ');
    }
    if(this.myForm.valid){   
      this.load = true;
      this.renderer.setProperty(document.documentElement, 'scrollTop', 0);
      this.renderer.setProperty(document.body, 'scrollTop', 0);
      const formData = new FormData();
        for (const field in this.myForm.controls) {
          if(field == 'plate_chars_en_filter_6'){
            formData.append(field, plate_chars_en_filter_6);
          }else if(field == 'plate_chars_filter_6'){
            formData.append(field, plate_chars_filter_6);
          }
          else if(field == 'plate_numbers_en_filter_6'){
            formData.append(field, plate_number_en_filter_6_value.split('').reverse().join(''));
          }else if(field == 'plate_numbers_filter_6'){
            formData.append(field, plate_number_filter_6_value);
          }else{
            formData.append(field, this.myForm.controls[field].value);
          }
        }
      this.editSub = this.productService.updateAdd(this.addId,formData).subscribe({
        next: (res: Update)=>{
          this.load = false;
          this.updateProduct = res;
          this.modelSuccessNewProduct.show();
        },
        error: (err: HttpErrorResponse)=>{
          this.load = false;
          this.errorHandel.openErrorModa(err);
        }
      });
  }else{
    return;
  }
  }
  close(){
    const modelSuccessNewProduct = document.getElementById('modelSuccessNewProduct');
    this.modelSuccessNewProduct.hide();
    modelSuccessNewProduct?.addEventListener('hidden.bs.modal', () => {
      this.route.navigate([`adds/${this.userId}`])
    })
  }
  ngOnDestroy() :void{
    if(this.editSub){
      this.editSub.unsubscribe();
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
  }
}
