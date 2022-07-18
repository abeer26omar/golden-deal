import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpHeadersInterceptor } from './interceptors/http-headers.interceptor';
import { HttpErrorInterceptor } from './interceptors/http-errors.interceptor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CarouselModule } from 'ngx-owl-carousel-o';
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
import { Ng2TelInputModule } from 'ng2-tel-input';
import { NgOtpInputModule } from  'ng-otp-input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar'


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
import { WhoWeAreComponent } from './who-we-are/who-we-are.component';
import { AccoutSettingComponent } from './accout-setting/accout-setting.component';
import { BuyingRecordComponent } from './buying-record/buying-record.component';
import { SearchproductsPipe } from './pipes/searchproducts.pipe';
import { RegisterComponent } from './Auth/register/register.component';
import { EditAddComponent } from './adds/edit-add/edit-add.component';
import { SubscriptionsComponent } from './subscriptions/subscriptions.component';
import { ProfileComponent } from './profile/profile.component';

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
    WhoWeAreComponent,
    AccoutSettingComponent,
    BuyingRecordComponent,
    SearchproductsPipe,
    RegisterComponent,
    EditAddComponent,
    SubscriptionsComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CarouselModule,
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
    Ng2TelInputModule,
    NgOtpInputModule,
    MatProgressSpinnerModule,
    MatProgressBarModule
    ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: HttpHeadersInterceptor,
    multi: true,
  },
  {
  provide: HTTP_INTERCEPTORS,
  useClass: HttpErrorInterceptor,
  multi: true
 }],
  bootstrap: [AppComponent]
})
export class AppModule { }
