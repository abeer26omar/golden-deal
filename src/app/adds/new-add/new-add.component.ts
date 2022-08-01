import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { APIResponse2, Category, CategoryFilter, NewProduct} from '../../models/products.model';
import { ProductsRequestService } from 'src/app/services/products-request.service';
import { HttpErrorResponse } from '@angular/common/http';
import { environment as env } from 'src/environments/environment';

declare var window: any;

@Component({
  selector: 'app-new-add',
  templateUrl: './new-add.component.html',
  styleUrls: ['./new-add.component.css']
})
export class NewAddComponent implements OnInit {
  step: any = 1;
  modelSuccessNewProduct: any;
  images : string[] = [];
  filtersArr: any = [];
  error: string = '';
  load: boolean = false;
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
  submitted = false;
  catergoryId!:number;
  ownerId = localStorage.getItem('userId');
  // productMark: string = '';
  NewProductRes: NewProduct = {
    data:{
      order_code: 0,
      msg: ''
    }
  }
  myForm = new FormGroup({
    agrement: new FormControl('', [Validators.required]),
    // fileSource: new FormControl('', [Validators.required]),
    seller_phone: new FormControl('', [Validators.required]),
    productStatus: new FormControl('', [Validators.required]),
    productCategory: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    productPrice: new FormControl('', [Validators.required]),
    about_seller: new FormControl('', [Validators.required]),
    sellerinfo: new FormControl('', [Validators.required]),
    productDesc: new FormControl('', [Validators.required]),
    productMaterial: new FormControl('', [Validators.required]),
    // file: new FormControl('', [Validators.required]),
  });
  private categorySub : Subscription = new Subscription;

  constructor(private httpService: ProductsRequestService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder) { 
    }
  get f(){
    return this.myForm.controls;
  }
  onFileChange(event:any) {
    if ((event.target.files && event.target.files[0]) || '') {
        var filesAmount = event.target.files.length;
        for (let i = 0; i < filesAmount; i++) {
                var reader = new FileReader();
                reader.onload = (event:any) => {
                  // console.log(event.target.result);
                   this.images.push(event.target.result); 
    
                   this.myForm.patchValue({
                      fileSource: this.images
                   });
                }
                reader.readAsDataURL(event.target.files[i]);
              }
            }else{
      this.myForm.controls['fileSource'].setValidators([Validators.required])
    }
  }
  ngOnInit(): void {
    this.getCategories();
    this.modelSuccessNewProduct = new window.bootstrap.Modal(
      document.getElementById('modelSuccessNewProduct')
    );  
  }
  getCategories(){
    this.categorySub = this.httpService.
    getProductsCategories().
    subscribe({
      next: (categoryList: APIResponse2<Category>)=>{ 
        this.categories = categoryList.data;
      },
      error:(error : HttpErrorResponse)=>{
        if(error){
          this.error = 'An unknown Error Occurred Check your Internet Connection Or Reload Your Page';
        }
      }
    })
  }
  getCategoryFilter(categoryName: any){    
    this.categorySub = this.httpService.getCategoryFilters(categoryName).subscribe({
      next: (res: CategoryFilter)=>{
        this.filters = res;
        this.filters.data.filters.forEach(filter=>{
          // console.log(filter);
          this.newFormControl = filter.slug_name;
          this.myForm.addControl(filter.slug_name, new FormControl('')) 
          this.filtersArr.push(this.newFormControl)
        })        
        console.log(this.filtersArr);
        
      },
      error: err=>{
        console.log(err);
      }
    })
  }
  submit(){
    this.submitted = true;    
    if((this.myForm.get('agrement')?.invalid)){
      return;
    } else{
      if(this.step == 1){
        this.step = this.step + 1;
        this.submitted = false;    
      }
      this.getProductCategoryId();   
      const formData = new FormData();
      let formArr = []
      for (const field in this.myForm.controls) { 
        // console.log(this.myForm.controls[field].value);
        let value = this.myForm.controls[field].value
        let obj = {
           field,value
        }
        formArr.push(obj)
        
        formData.append(field, this.myForm.controls[field].value) 
        // console.log('done');
      }
      // console.log(...formArr);
      
      
      if(this.myForm.valid){
        this.sendFormData();
        // this.httpService.http.post<NewProduct>(`${env.api_url}/products/store-new-product`,{
          
        // }
        // ,this.httpService.httpOptions)
        // .subscribe({
        //   next: (res: NewProduct)=>{
        //     this.load = false;
        //     this.NewProductRes = res;
        //     this.modelSuccessNewProduct.show();
        //     console.log(res);
        //   },
        //   error: err=>{
        //     this.load = false;
        //     console.log(err);
        //   }
        // })   
      } else{
        return;
      }
    }

  }
  ngOnDestory() :void{
    if(this.categorySub){
      this.categorySub.unsubscribe();
    } 
  }
  getProductCategoryId(){
    const productCategory = this.myForm.get('productCategory')?.value;
    this.categories.forEach(ele=>{
      if(productCategory == ele.slug){
        this.catergoryId = ele.id;
      }
    })
  }
  sendFormData(){
    this.load = true
    const fileSource = this.myForm.get('fileSource')?.value;
    const phone = this.myForm.get('seller_phone')?.value;
    const productName = this.myForm.get('name')?.value;
    const productPrice = this.myForm.get('productPrice')?.value;
    const productSeller = this.myForm.get('productSeller')?.value;
    const sellerinfo = this.myForm.get('sellerinfo')?.value;
    const productDesc = this.myForm.get('productDesc')?.value;
    const productMaterial = this.myForm.get('productMaterial')?.value;
    const file = this.myForm.get('file')?.value;
    this.filtersArr.forEach((ele: any)=>{
      if(this.myForm.contains(ele)){
        console.log(this.myForm.controls[ele].value);
        
      }
    })
     this.httpService.addNewProduct(phone,productSeller,this.catergoryId,productName
      ,productDesc,sellerinfo,productPrice,this.ownerId,productMaterial, )
       .subscribe({
            next: (res: NewProduct)=>{
              this.load = false;
              this.NewProductRes = res;
              this.modelSuccessNewProduct.show();
              console.log(res);
            },
            error: err=>{
              this.load = false;
              console.log(err);
            }
          })   
  }
}