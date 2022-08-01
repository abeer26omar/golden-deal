import { Component, OnInit } from '@angular/core';
import { Product} from '../../models/products.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductsRequestService } from '../../services/products-request.service';
import { NgForm } from '@angular/forms';
import { ActionsService } from 'src/app/services/actions.service';
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
      product_images:[],
      owner_ratings: []
    }
  }
  error: string = '';
  ProductId: string = '';
  formModal: any;
  formModal2: any;
  buyModal: any;

  private routeSub: Subscription = new Subscription;
  private productSub: Subscription = new Subscription;
  
  constructor(private httpService: ProductsRequestService, 
    private route: ActivatedRoute,
    private router: Router,
    private actionService : ActionsService) { }

  ngOnInit(): void {
      this.routeSub = this.route.params.subscribe((params: Params) => {
      this.ProductId = params['id'];
      this.getProductDetails(this.ProductId);
    });
    this.formModal = new window.bootstrap.Modal(
      document.getElementById('myModal')
    );
    this.formModal2 = new window.bootstrap.Modal(
      document.getElementById('staticBackdrop')
    );
    this.buyModal = new window.bootstrap.Modal(
      document.getElementById('buyModal')
    );
  }
  getProductDetails(id: string){
    this.productSub = this.httpService.getDetails(id)
    .subscribe({
      next:(productDetails: Product)=>{
        this.singleProduct = productDetails;
      },
      error: err=>{
        console.log(err)
      }
    })
  }
  addToFav(){
    this.actionService.addToFav(this.singleProduct.data.id)
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
      const providerid = this.singleProduct.data.owner_id;
      const desc = form.value.userdesc;
      const value = form.value.userrate;
      
      this.httpService.addRate(providerid , desc , value).subscribe({
        next: res=>{
          console.log(res)
        },
        error: err=>{
          console.log(err)
        }
      })
      form.reset()
      this.formModal.hide();
  }
  onBuy(){
    this.buyModal.show()
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
