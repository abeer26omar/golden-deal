import { Component, OnInit } from '@angular/core';
import { Product} from '../../products';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductsRequestService } from '../../services/products-request.service';
import { NgForm } from '@angular/forms';
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


  private routeSub: Subscription = new Subscription;
  private productSub: Subscription = new Subscription;
  constructor(private httpService: ProductsRequestService, 
    private route: ActivatedRoute,
    private router: Router) { }

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
  }
  getProductDetails(id: string){
    this.productSub = this.httpService.getDetails(id)
    .subscribe((productDetails: Product)=>{
      this.singleProduct = productDetails;
      console.log(this.singleProduct);
    })
  }
  productDsecription(){
    this.router.navigate(['desc'])
  }
  openFormModal() {
    this.formModal.show();
  }
  openFormModal2() {
    this.formModal2.show();
  }
  
  saveSomeThing() {
    // confirm or save something
    this.formModal.hide();
  }
  ngOnDestory() :void{
    if(this.productSub){
      this.productSub.unsubscribe();
    }
    if(this.routeSub){
     this.routeSub.unsubscribe();
   }
  }
  
onSubmit(form: NgForm){
  // console.log(form)
  if(!form.valid){
    return;
  }
    const providerid = 1;
    const desc = form.value.userdesc;
    const value = form.value.userrate;
    

    this.httpService.sendRate(providerid , desc , value).subscribe(resReview => {
    })
    form.reset()
  this.formModal.hide();
  }
}
