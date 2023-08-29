import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AsyncPipe, CommonModule } from '@angular/common';  
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LocationStrategy, HashLocationStrategy ,PathLocationStrategy} from '@angular/common';
import { HttpHeadersInterceptor } from './interceptors/http-headers.interceptor';
import { HttpErrorInterceptor } from './interceptors/http-errors.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgwWowModule } from 'ngx-wow';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';
import { NgxStarRatingModule } from 'ngx-star-rating';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgxFontAwesomeModule } from 'ngx-font-awesome';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu'
import { NgOtpInputModule } from  'ng-otp-input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSliderModule } from '@angular/material/slider';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatStepperModule } from '@angular/material/stepper';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { SwiperModule } from 'swiper/angular';
import { NgxGalleryModule } from 'ngx-gallery-9';
import { ClipboardModule } from 'ngx-clipboard';
import { NgxPaginationModule } from 'ngx-pagination';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireMessagingModule} from '@angular/fire/compat/messaging';
import { AngularFireModule } from '@angular/fire/compat';
import { GalleryModule } from  'ng-gallery';
import { LightboxModule } from  'ng-gallery/lightbox';

//components
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SearchComponent } from './search/search.component';
import { AddsBannerComponent } from './adds-banner/adds-banner.component';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';
import { ProductsComponent } from './products/products.component';
import { TestimonialComponent } from './testimonial/testimonial.component';
import { SearchResultComponent } from './search/search-result/search-result.component';
import { ProductDetailsComponent } from './products/product-details/product-details.component';
import { HomeComponent } from './home/home.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { ChatsComponent } from './chats/chats.component';
import { AddsComponent } from './adds/adds.component';
import { NewAddComponent } from './adds/new-add/new-add.component';
import { BuyingRecordComponent } from './buying-record/buying-record.component';
import { RegisterComponent } from './Auth/register/register.component';
import { EditAddComponent } from './adds/edit-add/edit-add.component';
import { SubscriptionsComponent } from './subscriptions/subscriptions.component';
import { ProfileComponent } from './profile/profile.component';
import { AddressComponent } from './address/address.component';
import { AddEditAddressComponent } from './address/add-edit-address/add-edit-address.component';
import { DialogMajorComponent } from './address/dialog-major/dialog-major.component';
import { DialogDeleteComponent } from './address/dialog-delete/dialog-delete.component';
import { DialogSolidComponent } from './adds/dialog-solid/dialog-solid.component';
import { DialogImageComponent } from './profile/dialog-image/dialog-image.component';
import { DialogCoverComponent } from './adds/dialog-cover/dialog-cover.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { ChatSupportComponent } from './chats/chat-support/chat-support.component';
import { SingleChatComponent } from './chats/single-chat/single-chat.component';
import { SellerProfileComponent } from './seller-profile/seller-profile.component';
import { ResponseModalComponent } from './response-modal/response-modal.component';
import { PaymentDetailsDialogComponent } from './subscriptions/payment-details-dialog/payment-details-dialog.component';
import { ResponseModalErrorComponent } from './response-modal-error/response-modal-error.component';
import { InputPipe } from './services/input.pipe';
import { DepositComponent } from './deposit/deposit.component';
import { DateAgoPipe } from './services/date-ago.pipe';
import { AuthRemainderModalComponent } from './auth-remainder-modal/auth-remainder-modal.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { environment } from 'src/environments/environment';
import { NotificationsService } from './services/notifications.service';
import { PaginatorModule } from 'primeng/paginator';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { ResetPassModalComponent } from './Auth/reset-pass-modal/reset-pass-modal.component';
import { LoginComponent } from './Auth/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SearchComponent,
    AddsBannerComponent,
    TermsConditionsComponent,
    ProductsComponent,
    TestimonialComponent,
    SearchResultComponent,
    ProductDetailsComponent,
    HomeComponent,
    NotfoundComponent,
    ChatsComponent,
    AddsComponent,
    NewAddComponent,
    BuyingRecordComponent,
    RegisterComponent,
    EditAddComponent,
    SubscriptionsComponent,
    ProfileComponent,
    AddressComponent,
    AddEditAddressComponent,
    DialogMajorComponent,
    DialogDeleteComponent,
    DialogSolidComponent,
    DialogImageComponent,
    DialogCoverComponent,
    SidenavComponent,
    ChatSupportComponent,
    SingleChatComponent,
    SellerProfileComponent,
    ResponseModalComponent,
    PaymentDetailsDialogComponent,
    ResponseModalErrorComponent,
    InputPipe,
    DepositComponent,
    DateAgoPipe,
    AuthRemainderModalComponent,
    NotificationsComponent,
    ResetPassModalComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgwWowModule,
    FormsModule,
    ReactiveFormsModule,
    NgxStarRatingModule,
    NgxFontAwesomeModule,
    NgbModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatSelectModule,
    MatRadioModule,
    MatButtonModule,
    NgOtpInputModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatMenuModule,
    MatDialogModule,
    MatSliderModule,
    NzSliderModule,
    MatSidenavModule,
    MatListModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatStepperModule,
    MatBadgeModule,
    MatSnackBarModule,
    ScrollingModule,
    SwiperModule,
    NgxGalleryModule,
    ClipboardModule,
    NgxPaginationModule,
    AngularFireAuthModule,
    AngularFireMessagingModule,
    AngularFireModule.initializeApp(environment.firebase),
    PaginatorModule,
    SlickCarouselModule,
    GalleryModule,
    LightboxModule
  ], 
  providers: [ NotificationsService, AsyncPipe,
    {provide: LocationStrategy, useClass: PathLocationStrategy},
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpHeadersInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
