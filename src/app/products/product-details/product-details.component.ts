import { Component, OnInit, AfterViewInit, Renderer2, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Product} from '../../models/products.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductsRequestService } from '../../services/products-request.service';
import { NgForm } from '@angular/forms';
import { ActionsService } from 'src/app/services/actions.service';
import { ResponseSuccess } from 'src/app/models/actions.model';
import { MacPrefixService } from 'src/app/services/mac-prefix.service';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery-9';
import { ChatService } from 'src/app/services/chat.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment as env } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.service';
import { AuthRemainderModalComponent } from 'src/app/auth-remainder-modal/auth-remainder-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { GalleryItem, ImageItem } from 'ng-gallery';
import { GoBackService } from 'src/app/services/go-back.service';
import { CookieService } from 'ngx-cookie-service';

declare var window: any;

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit ,AfterViewInit ,OnDestroy{
  galleryOptions: NgxGalleryOptions[] = [];
  galleryImages: NgxGalleryImage[] = [];
  cameraImages: GalleryItem[] = [];
  mac: boolean = false;
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
          phone: ''
      },
      admin_details:{
        cover_url: '',
        id: 0,
        image: '',
        image_url: '',
        name: '',
        phone: ''
    },
      product_images:[
       { id: 0,
        product_id: 0,
        image: '',
        image_url: ''}
      ],
      owner_ratings: [],
      negotiable: 0,
      properties:[],
      region_id: 0,
      region_name: "",
      category_slug: '',
      product_fav: false
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
  chatModal: any;
  messageTxt: string = '';
  userId: any = localStorage.getItem('userId') || this.cookieService.get('userId');
  receiverId: any;
  errMsg: string = '';
  sucessMsg: string = '';
  admin: any;
  showOwner: boolean = false;
  owner_id: any;
  is_animating: boolean = false;
  private routeSub: Subscription = new Subscription;
  private productSub: Subscription = new Subscription;
  imgUrls :any = [];
  constructor(private httpService: ProductsRequestService, 
    private route: ActivatedRoute,
    private router: Router,
    public actionService : ActionsService,
    private macService: MacPrefixService,
    private chatService: ChatService,
    private errorHandel: ErrorHandlerService,
    public authService: AuthService,
    private dialogRef: MatDialog,
    private http: HttpClient,
    private renderer: Renderer2,
    private goBackService: GoBackService,
    private cookieService: CookieService) { 
      this.actionService.refresh.subscribe(()=>{
        this.getProductDetails(this.ProductId);
      });
      this.route.fragment.subscribe((fragment: any) => {
        const fragmentParams = new URLSearchParams(fragment);
        this.goBackService.getFragments(
        fragmentParams.get('categorySlug'), 
        Number(fragmentParams.get('pageNumber')),
        fragmentParams.get('carPlateType'),
        fragmentParams.get('townFilter'),
        fragmentParams.get('brandFilter'),
        fragmentParams.get('brandSubFilter'),
        fragmentParams.get('regionFilter'),
        fragmentParams.get('filterBrandKey'),
        fragmentParams.get('selectedSlideIndex'),
        fragmentParams.get('selectedSlideSubBrandIndex'))
      })
    }
  @ViewChild('productContainer') productContainer!: ElementRef;
  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe((params: Params) => {
      this.ProductId = params['id'];
    });
    this.getProductDetails(this.ProductId);
    this.owner_id = localStorage.getItem('userId') || this.cookieService.get('userId');
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
    this.chatModal = new window.bootstrap.Modal(
      document.getElementById('chatModal'),{backdrop: this.macService.backdrop}
    );    
    this.galleryOptions = [
      {
          width: '90%',
          height: '750px',
          thumbnailsColumns: 4,
          thumbnailsMargin: 10,
          imageAnimation: NgxGalleryAnimation.Slide
      },
      // max-width 800
      {
          breakpoint: 800,
          width: '100%',
          height: '600px',
          imagePercent: 100,
          thumbnailsColumns: 3,
          thumbnailsPercent: 30,
          thumbnailMargin: 20
      },
      // max-width 400
      {
          breakpoint: 425,
          height: '350px',
          thumbnailsMargin: 0,
          thumbnailsColumns: 2,
          preview: true
      }
    ];
    this.galleryImages = this.imgUrls;
    if(this.macService.operatingSysDetect()){
      this.mac = true;
    }else{
      this.mac = false;
    }
  }
  ngAfterViewInit() {
    // document.documentElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  getProductDetails(id: string){
    this.productSub = this.httpService.getDetails(id)
    .subscribe({
      next:(productDetails: Product)=>{
        this.singleProduct = productDetails;  
        this.receiverId = this.singleProduct.data.owner_id;        
        if (this.owner_id == this.singleProduct.data.owner_id) {
          this.showOwner = true
        } else {
          this.showOwner = false
        }        
        [...productDetails.data.product_images].forEach(e=>{
          this.imgUrls.push({
              small: e.image_url,
              medium: e.image_url,
              big: e.image_url
          })
        });
        this.cameraImages = productDetails.data.product_images.map(item => new ImageItem({ src: item.image_url, thumb: item.image_url }));
        // document.documentElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.scrollTo(0,0)

        // [...productDetails.data.product_images].forEach(e=>{
        //   this.cameraImages.push(new ImageItem({ src: e.image_url, thumb: e.image_url }))
        // });
        // console.log(this.cameraImages);
        // [...productDetails.data.product_images].forEach(e => {
        //   const image = new ImageItem({ src: e.image_url, thumb: e.image_url });
        //   this.cameraImages.push(image);
        // });
        // console.log(this.cameraImages);
        
        // this.showSlides(this.slideIndex);
        // this.items = this.singleProduct.data.product_images.map(item =>
        //   new ImageItem({ src: item.image_url, thumb: item.image_url })
        // );
    
        // // Load items into the lightbox
        // this.basicLightboxExample();
    
        // // Load item into different lightbox instance
        // // With custom gallery config
        // this.withCustomGalleryConfig();
      },
      error: (err: HttpErrorResponse)=>{
        this.errorHandel.openErrorModa(err)
      }
    })
  }
  addToFav(product: any, event: MouseEvent){
    this.is_animating = true;
    if(this.authService.IsloggedIn()){
      if(product.product_fav == false){
        this.http.get<ResponseSuccess>(`${env.api_url}/favourites/add-favourite/${product.id}`,this.actionService.httpOptions)
        .subscribe({
          next: res=>{
            (event.target as HTMLElement).classList.toggle('heart_beat');
            product.product_fav = true  
          },
          error: (err: HttpErrorResponse)=>{
            this.errorHandel.openErrorModa(err)
          }
        })
      }else{
        this.http.get<ResponseSuccess>(`${env.api_url}/favourites/remove-favourite/${product.id}`,this.actionService.httpOptions)
        .subscribe({
          next: res=>{
            // this.actionService.handelRes(res)
            product.product_fav = false  
          },
          error: (err: HttpErrorResponse)=>{
            this.errorHandel.openErrorModa(err)
    
          }
        })
      }
    } else{
      this.dialogRef.open(AuthRemainderModalComponent,{
        data: {}
      })
      // this.route.navigate(['/register']);
    }
  }
  editAdd(id: number){
    this.router.navigate([`edit-add/${id}`])
  }
  deleteAdd(id: number,userId: number){
    this.productSub = this.httpService.deleteProduct(id).subscribe({
      next:(res: ResponseSuccess)=>{
        this.actionService.handelRes(res.data)
        setTimeout(()=>{
          this.router.navigate([`/adds`,userId])
        },50)
      },
      error: (err: HttpErrorResponse)=>{
        this.errorHandel.openErrorModa(err);
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
        error:(err: HttpErrorResponse)=>{
          this.loaderAdd = false;
          this.formModal2.hide();
          this.errorHandel.openErrorModa(err)
        }
      })
      form.reset();
      this.formModal.hide();
  }
  onBuy(){
    if(this.authService.IsloggedIn()){
      this.buyModal.show()
    }else{
      this.dialogRef.open(AuthRemainderModalComponent,{
        data: {}
      })
    }
  } 
  chat(data:any){
    localStorage.setItem('userInfoDeal',JSON.stringify(data))
    this.cookieService.set('userInfoDeal',JSON.stringify(data));
    this.router.navigate([`/userchat/${data.owner.id}`])
  }
  sendMsg(){
    const data = {
      sender: this.userId,
      receiver: this.receiverId,
      message: this.messageTxt
    }
    this.chatService.sendMessage(data); 
    this.messageTxt = '';
    this.chatModal.hide();
    setTimeout(()=>{
      this.router.navigate([`/chat`])
    },50)
  }
  sellerProfile(id:number){
    if(id == this.owner_id){
      this.router.navigate(['/adds',id])
    }else{
      this.router.navigate(['seller-profile',id])
    }
  }
  // gallery
  @ViewChild('slides') slidesRef!: ElementRef;
  @ViewChild('dots') dotsRef!: ElementRef;
slideIndex: number = 1;
plusSlides(n: number) {
  this.showSlides(this.slideIndex += n);
}

currentSlide(n: number) {
  this.showSlides(this.slideIndex = n);
}

showSlides(n: number) {
  const slides = this.slidesRef.nativeElement.getElementsByClassName('mySlides');
  const dots = this.dotsRef.nativeElement.getElementsByClassName('demo');  
  if (n > slides.length) { this.slideIndex = 1; }
  if (n < 1) { this.slideIndex = slides.length; }
  for (let i = 0; i < slides.length; i++) {
    this.renderer.setStyle(slides[i], 'display', 'none');
  }
  for (let i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(' active', '');
  }
  this.renderer.setStyle(slides[this.slideIndex-1], 'display', 'block');
  dots[this.slideIndex-1].className += ' active';
}
ngOnDestroy() :void{
    if(this.productSub){
      this.productSub.unsubscribe();
    }
    if(this.routeSub){
     this.routeSub.unsubscribe();
   }
}
}
