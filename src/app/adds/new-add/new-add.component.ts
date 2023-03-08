import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { APIResponse2, Category, CategoryFilter, NewProduct} from '../../models/products.model';
import { ProductsRequestService } from 'src/app/services/products-request.service';
import { HttpErrorResponse } from '@angular/common/http';
import { environment as env } from 'src/environments/environment';
import { MacPrefixService } from 'src/app/services/mac-prefix.service';

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
  load: boolean = false;
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
  submitted = false;
  catergoryId!:number;
  ownerId = localStorage.getItem('userId');
  NewProductRes: NewProduct = {
    data:{
      order_code: 0,
      msg: ''
    }
  }
 
  private categorySub : Subscription = new Subscription;
  private filterSub : Subscription = new Subscription;
  private sendSub: Subscription = new Subscription;
  constructor(private httpService: ProductsRequestService,
    private router: Router,
    private macService: MacPrefixService) { }
    
    myForm = new FormGroup({
      negotiable: new FormControl(''),
      seller_phone: new FormControl('', [Validators.required]),
      productCategory: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required]),
      about_seller: new FormControl(''),
      delivery_notes: new FormControl(''),
      desc: new FormControl('', [Validators.required]),
      materials: new FormControl('', [Validators.required]),
      owner_id: new FormControl(this.ownerId),
      category_id: new FormControl(''),
      ownership_image: new FormControl(''),
      product_image_1: new FormControl(''),
      product_image_2: new FormControl(''),
      product_image_3: new FormControl(''),
      product_image_4: new FormControl(''),
      product_image_5: new FormControl('')
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
      this.f['price'].disable()
    }else{
      this.negotiable = false;
      this.f['price'].enable()
    }
    console.log(this.negotiable);
  }
  onFileChange1(event:any) {
    let reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    this.file =<File>event.target.files[0];
    reader.onload = ()=>{
      this.imgSrc1 = reader.result;
      this.images.splice(0,1,this.imgSrc1)
    }
    this.myForm.get('product_image_1')?.patchValue(this.file,this.file.name);
  }
  onFileChange2(event:any) {
    let reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    this.file =<File>event.target.files[0];
    reader.onload = ()=>{
      this.imgSrc2 = reader.result;
      this.images.splice(2,1,this.imgSrc2)
    }
    this.myForm.get('product_image_2')?.patchValue(this.file,this.file.name);
  }
  onFileChange3(event:any) {
    let reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    this.file =<File>event.target.files[0];
    reader.onload = ()=>{
      this.imgSrc3 = reader.result;
      this.images.splice(1,1,this.imgSrc3)
    }    
    this.myForm.get('product_image_3')?.patchValue(this.file,this.file.name);
  }
  onFileChange4(event:any) {
    let reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    this.file =<File>event.target.files[0];
    reader.onload = ()=>{
      this.imgSrc4 = reader.result;
      this.images.splice(2,1,this.imgSrc4)
    }
    this.myForm.get('product_image_4')?.patchValue(this.file,this.file.name);
  }
  onFileChange5(event:any) {
    let reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    this.file =<File>event.target.files[0];
    reader.onload = ()=>{
      this.imgSrc5 = reader.result;
      this.images.splice(2,1,this.imgSrc5)
    }
    this.myForm.get('product_image_5')?.patchValue(this.file,this.file.name);
  }
  onFile(event:any) {
    let reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    this.file =<File>event.target.files[0];
    this.ownership = this.file.name
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
    }
    else{
      this.defaultImage_add = true;
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
    this.submitted = true;    
    // if((this.myForm.get('agrement')?.invalid)){
    //   return;
    // } 
    // else{
      // if(this.step == 0){
      //   this.step = this.step + 1;
      //   this.submitted = false;    
      // }
      this.getProductCategoryId();   
      const formData = new FormData();
      for (const field in this.myForm.controls) {
        formData.append(field, this.myForm.controls[field].value);
      }
      if(this.myForm.valid){
        this.load = true;
      this.sendSub = this.httpService.http.post<NewProduct>(`${env.api_url}/products/store-new-product`,
          formData,
        this.httpService.httpOptions)
        .subscribe({
          next: (res: NewProduct)=>{
            this.load = false;
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