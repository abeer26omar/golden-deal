import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SearchComponent } from './search/search.component';
import { AddsBannerComponent } from './adds-banner/adds-banner.component';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';
import { ProductsComponent } from './products/products.component';
import { TestimonialComponent } from './testimonial/testimonial.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
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
import { AuthGuardGuard } from './Guards/auth-guard.guard';



const routes: Routes = [
  { path:'', redirectTo: 'home', pathMatch:'full'},
  { path:'home', component:HomeComponent},
  { path:'product-details/:id', component:ProductDetailsComponent},
  { path:'chat', component:ChatsComponent},
  { path:'adds', component:AddsComponent},
  { path:'new-add', component:NewAddComponent},
  { path:'edit-add', component: EditAddComponent},
  { path:'subscriptions', component: SubscriptionsComponent},
  { path:'termsandconditions/:slug', component: TermsConditionsComponent},
  { path:'buyingrecord', component: BuyingRecordComponent, canActivate:[AuthGuardGuard]},
  { path:'register', component: RegisterComponent},
  { path:'profile', component: ProfileComponent, canActivate:[AuthGuardGuard]},
  { path:'address', component: AddressComponent, canActivate:[AuthGuardGuard]},
  { path:'add', component: AddEditAddressComponent , canActivate:[AuthGuardGuard]},
  { path:'edit/:id', component:AddEditAddressComponent, canActivate:[AuthGuardGuard]},
  { path:'**', component:NotfoundComponent}
];
const routerOptions: ExtraOptions = {
  scrollPositionRestoration: 'enabled',
  anchorScrolling: 'enabled',
  scrollOffset: [0, 64],
};

@NgModule({
  imports: [RouterModule.forRoot(routes,routerOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
