import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { APIResponse2, Category, CategoryFilter, NewProduct} from '../../models/products.model';
import { ProductsRequestService } from 'src/app/services/products-request.service';
import { HttpErrorResponse } from '@angular/common/http';
import { environment as env } from 'src/environments/environment';
import { MacPrefixService } from 'src/app/services/mac-prefix.service';
import { NgOtpInputComponent, NgOtpInputConfig } from 'ng-otp-input';

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
  error_CarPlate_bool: boolean = false;
  file!: File;
  imgSrc1: any;
  imgSrc2: any;
  imgSrc3: any;
  imgSrc4: any;
  imgSrc5: any;
  ownership: any;
  negotiable: boolean = false;
  newFormControl!: any;
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
  // submitted = false;
  catergoryId!:number;
  ownerId = localStorage.getItem('userId');
  NewProductRes: NewProduct = {
    data:{
      order_code: 0,
      msg: ''
    }
  }
  plates_chars: any = [
    { char: 'أ' , trans: 'A' },
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
  // otp card chars
  @ViewChild(NgOtpInputComponent, { static: false}) ngOtpInput!:NgOtpInputComponent;
  subOtp: boolean = true;
  otp!: string ;
  showOtpComponent = true;
  configAr:NgOtpInputConfig = {
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
  };
  onOtpChange(otp:any) {
    // this.ngOtpInput.setValue(otp);
    console.log(otp);
    // this.otp = otp;
    // if(otp.length == 4){
    //   this.subOtp = !this.subOtp;
    // }
  }
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
  private categorySub : Subscription = new Subscription;
  private filterSub : Subscription = new Subscription;
  private sendSub: Subscription = new Subscription;
  constructor(private httpService: ProductsRequestService,
    private router: Router,
    private macService: MacPrefixService) {
      // this.ngOtpInput.otpForm.disable();
     }
    
    myForm = new FormGroup({
      seller_phone: new FormControl('', [Validators.required]),
      productCategory: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required]),
      desc: new FormControl('', [Validators.required]),
      owner_id: new FormControl(this.ownerId),
      negotiable: new FormControl(''),
      category_id: new FormControl(''),
      ownership_image: new FormControl(''),
      product_image_1: new FormControl('',Validators.required),
      product_image_2: new FormControl('',Validators.required),
      product_image_3: new FormControl('',Validators.required),
      product_image_4: new FormControl('',Validators.required),
      product_image_5: new FormControl('',Validators.required),
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
      )
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
    }
  }
  onFile(event:any) {
    let reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    this.file =<File>event.target.files[0];
    this.ownership = this.file.name
  }
  getCardChar(key: number,value: any){
    let plate_char = value.target.value;
    let trans_values: any = [], trans_value:any;
    this.error_CarPlate = '';
    switch(key){
      case 1: 
        this.plates_chars.forEach((char: any) => {
          if(char.char == plate_char){
            this.error_CarPlate = '';
            trans_values.push(char.char)
            return trans_value = char.trans;
          }else{
            this.error_CarPlate = 'حروف اللوحه يجب ان تكون ضمن هذه المجموعه [أ-ب-ح-د-ر-س-ص-ط-ع-ق-ك-ل-م-ن-ه-و-ى]';          
          }
        });
        this.myForm.get('plate_chars_en_1')?.setValue(trans_value)
      break;
      case 2:
        this.plates_chars.forEach((char: any) => {
          if(char.char == plate_char){
            this.error_CarPlate = '';
            trans_values.push(char.char)
            return trans_value = char.trans;
          }else{
            this.error_CarPlate = 'حروف اللوحه يجب ان تكون ضمن هذه المجموعه [أ-ب-ح-د-ر-س-ص-ط-ع-ق-ك-ل-م-ن-ه-و-ى]';
          }
        });
        this.myForm.get('plate_chars_en_2')?.setValue(trans_value)
      break;
      case 3:
        this.plates_chars.forEach((char: any) => {
          if(char.char == plate_char){
            this.error_CarPlate = '';
            trans_values.push(char.char)
            return trans_value = char.trans;
          }else{
            this.error_CarPlate = 'حروف اللوحه يجب ان تكون ضمن هذه المجموعه [أ-ب-ح-د-ر-س-ص-ط-ع-ق-ك-ل-م-ن-ه-و-ى]';
          }
        });
        this.myForm.get('plate_chars_en_3')?.setValue(trans_value)
      break;
    }
    this.myForm.get('plate_chars_filter_6')?.setValue(trans_values)
  }
  getValue(event: any,slug_name: any){
    let final_values:any = {}
    final_values = {
      slug_name:slug_name,
      event:event
    }
    let final_arr;
    this.valueArr.push(final_values);
    final_arr = this.valueArr.find((name: any) => name.slug_name == slug_name);
    if(slug_name == final_arr){
      this.valueArr.push(final_arr);
    }
    console.log(this.valueArr);
    // final_arr.push(final_values)
    // console.log(final_arr);
    // this.f['desc'].setValue(this.valueArr)
    
      // if(slug_name == final_values.slug_name){
      //   final_values.event = event
      // }
      // else{
      // }
    // this.valueArr.forEach((e: any)=>{
    //   // final_values.push({slug_name:slug_name,event:event}))
    // })
      
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
  getCategoryFilter(categoryName: any){ 
    if(categoryName == 'car_plates'){
      this.defaultImage_add = false;
      this.myForm.removeControl('product_image_1');
      this.myForm.removeControl('product_image_2');
      this.myForm.removeControl('product_image_3');
      this.myForm.removeControl('product_image_4');
      this.myForm.removeControl('product_image_5');
      this.myForm.addControl('plate_chars_en_1', new FormControl(''));
      this.myForm.addControl('plate_chars_en_2', new FormControl(''));
      this.myForm.addControl('plate_chars_en_3', new FormControl(''));
    }
    else{
      this.defaultImage_add = true;
      this.myForm.addControl('product_image_1', new FormControl('',Validators.required));
      this.myForm.addControl('product_image_2', new FormControl('',Validators.required));
      this.myForm.addControl('product_image_3', new FormControl('',Validators.required));
      this.myForm.addControl('product_image_4', new FormControl('',Validators.required));
      this.myForm.addControl('product_image_5', new FormControl('',Validators.required));
      this.myForm.removeControl('plate_chars_en_1');
      this.myForm.removeControl('plate_chars_en_2');
      this.myForm.removeControl('plate_chars_en_3');
    }
    this.categories.forEach(ele=>{
      if(ele.slug == categoryName){
        this.catergoryId = ele.id;
        this.myForm.get('category_id')?.patchValue(ele.id)
      }
    })
    this.filterSub = this.httpService.getCategoryFilters(categoryName).subscribe({
      next: (res: CategoryFilter)=>{
        this.filters = res;
        console.log(this.filters);
                
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
  submit(){
    if(this.myForm.valid){
      this.getProductCategoryId();   
      const formData = new FormData();
      for (const field in this.myForm.controls) {
        formData.append(field, this.myForm.controls[field].value);
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
          error: (err: HttpErrorResponse)=>{
            this.load = false;
            if(err.error.data){
              this.error = err.error.data;
            }else{
              this.error = err.statusText;
            }
            this.addFaild.show();
          }
        })   
      } else{
        console.log(this.myForm);
        this.errorAdd = 'يجب ادخال البيانات'
        return;
      }
    // }
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