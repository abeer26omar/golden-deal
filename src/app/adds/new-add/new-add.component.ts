import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  modelAddImages: any;
  addFaild: any;
  images : string[] = [];
  filtersArr: any = [];
  error: string = '';
  load: boolean = false;
  file!: File;
  imgSrc: any;
  imgSrc1: any;
  imgSrc3: any;
  ownership: any;
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
    private route: ActivatedRoute,
    private router: Router) { }
    
    myForm = new FormGroup({
      agrement: new FormControl('', [Validators.required]),
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
      product_image_3: new FormControl('')
    })
    get f(){
      return this.myForm.controls;
    }
  ngOnInit(): void {
      this.getCategories();
      this.modelSuccessNewProduct = new window.bootstrap.Modal(
        document.getElementById('modelSuccessNewProduct')
      );  
      this.modelAddImages = new window.bootstrap.Modal(
        document.getElementById('modelAddImages')
      );
      this.addFaild = new window.bootstrap.Modal(
        document.getElementById('addFaild')
      )
  }
  onFileChange(event:any) {
    let reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    this.file =<File>event.target.files[0];
    reader.onload = ()=>{
      this.imgSrc = reader.result;
      this.images.splice(0,1,this.imgSrc)
    }
    this.myForm.get('product_image_1')?.patchValue(this.file,this.file.name);
  }
  onFileChange3(event:any) {
    let reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    this.file =<File>event.target.files[0];
    reader.onload = ()=>{
      this.imgSrc3 = reader.result;
      this.images.splice(1,1,this.imgSrc3)
    }    
    this.myForm.get('product_image_2')?.patchValue(this.file,this.file.name);
  }
  onFileChange1(event:any) {
    let reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    this.file =<File>event.target.files[0];
    reader.onload = ()=>{
      this.imgSrc1 = reader.result;
      this.images.splice(2,1,this.imgSrc1)
    }
    this.myForm.get('product_image_3')?.patchValue(this.file,this.file.name);
  }
  onFile(event:any) {
    let reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    this.file =<File>event.target.files[0];
    this.ownership = this.file.name
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
    if((this.myForm.get('agrement')?.invalid)){
      return;
    } else{
      if(this.step == 1){
        this.step = this.step + 1;
        this.submitted = false;    
      }
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