import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup} from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { APIResponse2, APIResponse4, Category, EditProduct, EditProductFilters, Update } from 'src/app/models/products.model';
import { ProductsRequestService } from 'src/app/services/products-request.service';
import { MacPrefixService } from 'src/app/services/mac-prefix.service';
declare var window: any;

@Component({
  selector: 'app-edit-add',
  templateUrl: './edit-add.component.html',
  styleUrls: ['./edit-add.component.css']
})
export class EditAddComponent implements OnInit {
  images : string[] = [];
  addId!: number;
  addCategory: string = '';
  error: string = '';
  modelSuccessNewProduct: any;
  modelAddImages: any;
  addFaild: any;
  file!: File;
  imgSrc1: any;
  imgSrc2: any;
  imgSrc3: any;
  imgSrc4: any;
  imgSrc5: any;
  rest_images: any = [];
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
        price: 0,
        status: '',
        active: 0,
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
        ]
    }
  }
  myForm = new FormGroup({
    seller_phone: new FormControl(''),
    productCategory: new FormControl(''),
    name: new FormControl(''),
    price: new FormControl(''),
    desc: new FormControl(''),
    owner_id: new FormControl(''),
    category_id: new FormControl(''),
    product_image_1: new FormControl(''),
    product_image_2: new FormControl(''),
    product_image_3: new FormControl(''),
    product_image_4: new FormControl(''),
    product_image_5: new FormControl('')
  });
  updateProduct: Update = {
    data:{
      order_code: 0,
      msg: ''
    }
  }
  public categories : Array<Category> = [];
  public EditFilter: Array<EditProductFilters> = [];

  private editSub : Subscription = new Subscription;
  private routeSub: Subscription = new Subscription;
  private categorySub : Subscription = new Subscription;


  constructor(private productService: ProductsRequestService,
    private router: ActivatedRoute,
    private macService: MacPrefixService) { }
  get f(){
    return this.myForm.controls;
  }
  ngOnInit(): void {
    this.routeSub = this.router.params.subscribe((params: Params) => {
      this.addId = params['id'];
    })
    this.getAddInfo(this.addId);
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
  }
  onFileChange(key: number,event: any){
    console.log(key);
    let reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    this.file =<File>event.target.files[0];
    switch(key){
      case 1:
        reader.onload = ()=>{
          this.imgSrc1 = reader.result;
          document.getElementById('imgSrc_1')?.setAttribute('src', this.imgSrc1)
        }
        this.myForm.get('product_image_1')?.patchValue(this.file,this.file.name);
        break;
      case 2:
        reader.onload = ()=>{
          this.imgSrc2 = reader.result;
          document.getElementById('imgSrc_2')?.setAttribute('src', this.imgSrc2)
        }
        this.myForm.get('product_image_2')?.patchValue(this.file,this.file.name);
      break;
      case 3:
        reader.onload = ()=>{
          this.imgSrc3 = reader.result;
          document.getElementById('imgSrc_3')?.setAttribute('src', this.imgSrc3)
        }
        this.myForm.get('product_image_3')?.patchValue(this.file,this.file.name);
      break;
      case 4:
        reader.onload = ()=>{
          this.imgSrc4 = reader.result;
          document.getElementById('imgSrc_4')?.setAttribute('src', this.imgSrc4)
        }
        this.myForm.get('product_image_4')?.patchValue(this.file,this.file.name);
      break;
      case 5:
        reader.onload = ()=>{
          this.imgSrc5 = reader.result;
          document.getElementById('imgSrc_5')?.setAttribute('src', this.imgSrc5)
        }
        this.myForm.get('product_image_5')?.patchValue(this.file,this.file.name);
      break;
    }
  }
  getCategories(){
    this.categorySub = this.productService.
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
  getAddInfo(id: number){
    this.editSub = this.productService.getEditAddInfo(id).subscribe({
      next: (res: EditProduct)=>{
        this.Add = res;
        this.addCategory = this.Add.data.category_slug;
        this.Add.data.product_images.forEach(ele=>{
         this.images.push(ele.image_url)
        })
        for(let i=5; i > this.Add.data.product_images.length; i--){
            this.rest_images.push(i)
          }
        this.myForm = new FormGroup({
          seller_phone: new FormControl(this.Add.data.seller_phone),
          productCategory: new FormControl(this.Add.data.category_slug),
          name: new FormControl(this.Add.data.name),
          price: new FormControl(this.Add.data.price),
          desc: new FormControl(this.Add.data.desc),
          owner_id: new FormControl(this.Add.data.owner_id),
          category_id: new FormControl(this.Add.data.category_id),
        });
        this.getAddFilters();
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
  getAddFilters(){
    this.editSub = this.productService.getEditFilters(this.addId,this.addCategory).subscribe({
      next: (res: APIResponse4<EditProductFilters>)=>{
        this.EditFilter = res.data;
        this.EditFilter.forEach(ele=>{    
          if(ele.filter_value !== null){
            this.myForm.addControl(ele.slug_name,new FormControl({value: ele.filter_value.filter_value}))
          } else{
            this.myForm.addControl(ele.slug_name,new FormControl({value: ''}))
          }
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
  openImgDialog(){
    this.modelAddImages.show();
  }
  submit(){
    const formData = new FormData();
      for (const field in this.myForm.controls) {
        formData.append(field, this.myForm.controls[field].value);
      }
    this.editSub = this.productService.updateAdd(this.addId,formData).subscribe({
      next: (res: Update)=>{
        this.updateProduct = res;
        this.modelSuccessNewProduct.show()
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
  close(){
    this.modelAddImages.hide()
  }
  ngOnDestory() :void{
    if(this.editSub){
      this.editSub.unsubscribe();
    }
    if(this.routeSub){
      this.routeSub.unsubscribe();
    }
    if(this.categorySub){
      this.categorySub.unsubscribe();
    }
  }
}
