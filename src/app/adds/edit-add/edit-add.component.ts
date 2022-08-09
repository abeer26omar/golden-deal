import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup} from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { APIResponse2, APIResponse4, Category, EditProduct, EditProductFilters, Update } from 'src/app/models/products.model';
import { ProductsRequestService } from 'src/app/services/products-request.service';
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
  imgSrc: any;
  imgSrc1: any;
  imgSrc3: any;
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
    about_seller: new FormControl(''),
    delivery_notes: new FormControl(''),
    desc: new FormControl(''),
    materials: new FormControl(''),
    owner_id: new FormControl(''),
    category_id: new FormControl(''),
    ownership_image: new FormControl(''),
    product_image_1: new FormControl(''),
    product_image_2: new FormControl(''),
    product_image_3: new FormControl('')
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
    private route: Router,
    private router: ActivatedRoute) { }
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
      document.getElementById('modelSuccessNewProduct')
    );  
    this.modelAddImages = new window.bootstrap.Modal(
      document.getElementById('modelAddImages')
    );
    this.addFaild = new window.bootstrap.Modal(
      document.getElementById('addFaild')
    );
  }
  onFileChange(event:any) {
    let reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    this.file =<File>event.target.files[0];
    reader.onload = ()=>{
      this.imgSrc = reader.result;
      this.images.push(this.imgSrc)
    }
    this.myForm.get('product_image_1')?.patchValue(this.file,this.file.name);
  }
  onFileChange3(event:any) {
    let reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    this.file =<File>event.target.files[0];
    reader.onload = ()=>{
      this.imgSrc3 = reader.result;
      this.images.push(this.imgSrc3);
    }
    this.myForm.get('product_image_2')?.patchValue(this.file,this.file.name);
  }
  onFileChange1(event:any) {
    let reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    this.file =<File>event.target.files[0];
    reader.onload = ()=>{
      this.imgSrc1 = reader.result;
      this.images.push(this.imgSrc1)
    }
    this.myForm.get('product_image_3')?.patchValue(this.file,this.file.name);
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
        this.myForm = new FormGroup({
          seller_phone: new FormControl(this.Add.data.seller_phone),
          productCategory: new FormControl(this.Add.data.category_slug),
          name: new FormControl(this.Add.data.name),
          price: new FormControl(this.Add.data.price),
          about_seller: new FormControl(this.Add.data.about_seller),
          delivery_notes: new FormControl(this.Add.data.delivery_notes),
          desc: new FormControl(this.Add.data.desc),
          materials: new FormControl(this.Add.data.materials),
          owner_id: new FormControl(this.Add.data.owner_id),
          category_id: new FormControl(this.Add.data.category_id),
          ownership_image: new FormControl(this.Add.data.ownership_image_url),
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
          this.myForm.addControl(ele.slug_name,new FormControl(ele.filter_value.filter_value))
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
