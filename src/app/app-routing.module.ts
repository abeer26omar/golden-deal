import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';

import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';
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
import { SellerProfileComponent } from './seller-profile/seller-profile.component';
import { DepositComponent } from './deposit/deposit.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { SingleChatComponent } from './chats/single-chat/single-chat.component';
import { LoginComponent } from './Auth/login/login.component';
import { ChatSupportComponent } from './chats/chat-support/chat-support.component';
import { PrivateMarketingComponent } from './private-marketing/private-marketing.component';



const routes: Routes = [
  { path:'', component: HomeComponent},
  { path:'search-result',component: SearchResultComponent},
  { path:'search-result/:key',component: SearchResultComponent},
  { path:'product-details/:id', component: ProductDetailsComponent},
  { path:'seller-profile/:id', component: SellerProfileComponent,canActivate:[AuthGuardGuard]},
  { path:'chat', component: ChatsComponent, canActivate: [AuthGuardGuard]},
  { path:'support', component: ChatSupportComponent,canActivate: [AuthGuardGuard]},
  { path:'userchat/:id', component: SingleChatComponent,canActivate:[AuthGuardGuard]},
  { path:'adds/:id', component: AddsComponent, canActivate:[AuthGuardGuard]},
  { path:'new-add', component: NewAddComponent,canActivate:[AuthGuardGuard]},
  { path:'edit-add/:id', component: EditAddComponent},
  { path:'subscriptions', component: SubscriptionsComponent,canActivate:[AuthGuardGuard]},
  { path:'termsandconditions/:slug', component: TermsConditionsComponent},
  { path:'buyingrecord', component: BuyingRecordComponent, canActivate:[AuthGuardGuard]},
  { path:'register', component: RegisterComponent},
  { path:'login', component: LoginComponent},
  { path:'profile', component: ProfileComponent, canActivate:[AuthGuardGuard]},
  { path:'address', component: AddressComponent, canActivate:[AuthGuardGuard]},
  { path:'add', component: AddEditAddressComponent, canActivate:[AuthGuardGuard]},
  { path:'edit/:id', component: AddEditAddressComponent, canActivate:[AuthGuardGuard]},
  { path:'deposit', component: DepositComponent},
  { path:'notification', component: NotificationsComponent},
  { path:'private-marketing', component: PrivateMarketingComponent},
  { path:'**', component: NotfoundComponent}
];
const routerOptions: ExtraOptions = {
  scrollPositionRestoration: 'enabled',
  anchorScrolling: 'enabled',
  scrollOffset: [0, 0],
};

@NgModule({
  imports: [RouterModule.forRoot(routes,routerOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
