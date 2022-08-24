import { Component, OnInit } from '@angular/core';
import { Product} from '../../models/products.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { skip, Subscription } from 'rxjs';
import { ProductsRequestService } from '../../services/products-request.service';
import { NgForm } from '@angular/forms';
import { ActionsService } from 'src/app/services/actions.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ResponseSuccess } from 'src/app/models/actions.model';
import { AdminService } from 'src/app/services/admin.service';
import { MacPrefixService } from 'src/app/services/mac-prefix.service';
declare var window: any;

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  singleProduct : Product = {
    data: {
      id: 0,
      name: '',
      desc: '',
      materials: '',
      about_seller: '',
      delivery_notes: '',
      owner_id: 0,
      category_id: 0,
      seller_phone: '',
      price: '',
      status: '',
      active: '',
      created_since: '',
      default_image: '',
      ownership_image_url: '',
      owner: {
          id: 0,
          name: '',
          subscribed: 0,
          image_url: '',
          cover_url: '',
      },
      admin_details:{
        cover_url: '',
        id: 0,
        image: '',
        image_url: '',
        name: '',
        phone: ''
    },
      product_images:[],
      owner_ratings: []
    }
  }
  error: string = '';
  ProductId: string = '';
  loaderAdd: boolean = false;
  formModal: any;
  formModal2: any;
  buyModal: any;
  success:any;
  faild: any;
  errMsg: string = '';
  sucessMsg: string = '';
  admin: any;
  private routeSub: Subscription = new Subscription;
  private productSub: Subscription = new Subscription;
  
  constructor(private httpService: ProductsRequestService, 
    private route: ActivatedRoute,
    private router: Router,
    private actionService : ActionsService,
    private adminService: AdminService,
    private macService: MacPrefixService) { }

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe((params: Params) => {
      this.ProductId = params['id'];
      this.getProductDetails(this.ProductId);
    });
    this.formModal = new window.bootstrap.Modal(
      document.getElementById('myModal'),{backdrop: this.macService.backdrop}
    );
    this.formModal2 = new window.bootstrap.Modal(
      document.getElementById('staticBackdrop'),{backdrop: this.macService.backdrop}
    );
    this.buyModal = new window.bootstrap.Modal(
      document.getElementById('buyModal'),{backdrop: this.macService.backdrop}
    );
    this.success = new window.bootstrap.Modal(
      document.getElementById('success'),{backdrop: this.macService.backdrop}
    );
    this.faild = new window.bootstrap.Modal(
      document.getElementById('faild'),{backdrop: this.macService.backdrop}
    );
  }
  getProductDetails(id: string){
    this.productSub = this.httpService.getDetails(id)
    .subscribe({
      next:(productDetails: Product)=>{
        this.singleProduct = productDetails;
        // this.admin = this.singleProduct.data.admin_details.id
      },
      error:(err: HttpErrorResponse)=>{
        this.faild.show();
        this.errMsg = err.error.data;
      }
    })
  }
  addToFav(){
    this.actionService.addToFav(this.singleProduct.data.id).subscribe({
      next:(res:ResponseSuccess)=>{
        this.sucessMsg = res.data;
        this.success.show();
      },
      error:(err: HttpErrorResponse)=>{
        this.faild.show();
        if(err.error.data){
          this.errMsg = err.error.data;
        } else{
          if(err.statusText == 'Unauthorized'){
            this.errMsg = 'يجب انشاء حساب اولا';
          }else{
            this.errMsg = err.statusText;
          }
        }
      }
    })
  }
  openFormModal() {
    this.formModal.show();
  }
  openFormModal2() {
    this.formModal2.show();
  }
  onSubmit(form: NgForm){
    if(!form.valid){
      return;
    }
    this.loaderAdd = true;
      const providerid = this.singleProduct.data.owner_id;
      const desc = form.value.userdesc;
      const value = form.value.userrate;
      this.httpService.addRate(providerid , desc , value).subscribe({
        next: (res: ResponseSuccess)=>{
          this.loaderAdd = false;
          this.formModal2.hide();
          this.sucessMsg = res.data;
          this.success.show();
        },
        error: (err: HttpErrorResponse)=>{
          this.loaderAdd = false;
          this.formModal2.hide();
          this.faild.show();
          if(err.error.data){
            this.errMsg = err.error.data;
          } else{
            if(err.statusText == 'Unauthorized'){
              this.errMsg = 'يجب انشاء حساب اولا';
            }else{
              this.errMsg = err.statusText;
            }
          }
        }
      })
      form.reset();
      this.formModal.hide();
  }
  onBuy(){
    this.buyModal.show()
  } 
  chat(data:any){
    this.router.navigate([`/chat`])
    this.adminService.setOption(data)
  }
  ngOnDestory() :void{
    if(this.productSub){
      this.productSub.unsubscribe();
    }
    if(this.routeSub){
     this.routeSub.unsubscribe();
   }
  }
}
