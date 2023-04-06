import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup} from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { APIResponse2, APIResponse4, Category, EditProduct, EditProductFilters, Update } from 'src/app/models/products.model';
import { ProductsRequestService } from 'src/app/services/products-request.service';
import { MacPrefixService } from 'src/app/services/mac-prefix.service';
import { ActionsService } from 'src/app/services/actions.service';
import { Regions } from 'src/app/models/actions.model';
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
  negotiable: boolean = false;
  imgSrc1: any;
  imgSrc2: any;
  imgSrc3: any;
  imgSrc4: any;
  imgSrc5: any;
  error_CarPlate: string = '';
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
    plate_chars_filter_6: new FormGroup({}),
    plate_chars_en_filter_6: new FormGroup({}),
  });
  updateProduct: Update = {
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
  public categories : Array<Category> = [];
  public EditFilter: Array<EditProductFilters> = [];

  private editSub : Subscription = new Subscription;
  private routeSub: Subscription = new Subscription;
  private categorySub : Subscription = new Subscription;
  private filterSub : Subscription = new Subscription;


  constructor(private productService: ProductsRequestService,
    private router: ActivatedRoute,
    private macService: MacPrefixService,
    private actionService: ActionsService ) { }
  get f(){
    return this.myForm.controls;
  }
  ngOnInit(): void {
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
         this.images.push(ele.image_url)
        })
        for(let i=5; i > this.Add.data.product_images.length; i--){
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
            });
          }
        this.getAddFilters();
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
              let plate_chars_filter_6 = this.myForm.get('plate_chars_filter_6') as FormGroup;
              plate_chars_filter_6.addControl('plate_chars_ar_1', new FormControl(ele.filter_value.filter_value[0]));
              plate_chars_filter_6.addControl('plate_chars_ar_2', new FormControl(ele.filter_value.filter_value[2]));
              plate_chars_filter_6.addControl('plate_chars_ar_3', new FormControl(ele.filter_value.filter_value[4]));
            }else if(ele.slug_name == 'plate_chars_en_filter_6'){
              let plate_chars_en_filter_6 = this.myForm.get('plate_chars_en_filter_6') as FormGroup  
              plate_chars_en_filter_6.addControl('plate_chars_en_1', new FormControl(ele.filter_value.filter_value[0]));
              plate_chars_en_filter_6.addControl('plate_chars_en_2', new FormControl(ele.filter_value.filter_value[2]));
              plate_chars_en_filter_6.addControl('plate_chars_en_3', new FormControl(ele.filter_value.filter_value[4]));
            }else{
              this.myForm.addControl(ele.slug_name,new FormControl(ele.filter_value.filter_value))
            }
          }else{
            this.myForm.addControl(ele.slug_name,new FormControl(''))
          }
        })
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
    let trans_value:any;
    this.error_CarPlate = '';
    switch(key){
      case 1: 
        this.plates_chars.forEach((char: any) => {
          if(char.char == plate_char){
            this.error_CarPlate = '';
            return trans_value = char.trans;
          }else{
            this.error_CarPlate = 'حروف اللوحه يجب ان تكون ضمن هذه المجموعه [أ-ب-ح-د-ر-س-ص-ط-ع-ق-ك-ل-م-ن-ه-و-ى]';          
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
  openImgDialog(){
    this.modelAddImages.show();
  }
  submit(){
    let plate_chars_en_filter_6: any, 
    plate_chars_filter_6: any;
    if(this.myForm.get('productCategory')?.value == 'car_plates'){
      plate_chars_en_filter_6 = Object.values(this.myForm.get('plate_chars_en_filter_6')?.value).join(' ');
      plate_chars_filter_6 = Object.values(this.myForm.get('plate_chars_filter_6')?.value).join(' ')
    }
    const formData = new FormData();
      for (const field in this.myForm.controls) {
        if(field == 'plate_chars_en_filter_6'){
          formData.append(field, plate_chars_en_filter_6);
        }else if(field == 'plate_chars_filter_6'){
          formData.append(field, plate_chars_filter_6);
        }else{
          formData.append(field, this.myForm.controls[field].value);
        }
      }
    this.editSub = this.productService.updateAdd(this.addId,formData).subscribe({
      next: (res: Update)=>{
        this.updateProduct = res;
        this.modelSuccessNewProduct.show()
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
    if(this.filterSub){
      this.filterSub.unsubscribe();
    }
  }
}
