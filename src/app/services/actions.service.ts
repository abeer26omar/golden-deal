import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { environment as env } from 'src/environments/environment';
import { Subject, of, tap } from 'rxjs';
import { APIresponse, APIresponse2, Favourites, Orders, Portfolio, Provider, ResponseSuccess, Subscriptions, Regions, UserProducts } from '../models/actions.model';
import { APIResponse, Products, SplashScreen } from '../models/products.model';
import { MatDialog } from '@angular/material/dialog';
import { ResponseModalComponent } from '../response-modal/response-modal.component';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class ActionsService {
  constructor(private http: HttpClient,
    private dialogRef: MatDialog,
    private errorHandel: ErrorHandlerService) { }
  private _refresh = new Subject<void>();
  get refresh(){
    return this._refresh;
  }
  httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token_deal')}`
    })
  }
  subscribtionsTypeList!: APIresponse<Subscriptions>;
  portfolioData!: Portfolio;
  private previousPortfolioData!: number
  userProducts!: UserProducts;
  private previousUserProductId!: number;
  private previousUserProductPageNo!: number; 
  userFav!: Favourites;
  regions!: Regions;
  getSubscribtionsType(){
    if(this.subscribtionsTypeList){
      return of(this.subscribtionsTypeList);
    }else{
      return this.http.get<APIresponse<Subscriptions>>(`${env.api_url}/subscriptions/get-types`,this.httpOptions).pipe(
        tap(subscribtionsType=>{
          this.subscribtionsTypeList = subscribtionsType;
        })
      )
    }
  }
  getPortfolio(id: number){
    if(this.portfolioData && this.previousPortfolioData === id){
      return of(this.portfolioData);
    }else{
      this.previousPortfolioData = id;
      return this.http.get<Portfolio>(`${env.api_url}/portfolio/user/${id}`,this.httpOptions).pipe(
        tap(portfolio=>{
          this.portfolioData =portfolio;
        })
      )
    }
  }
  getPortfolioProducts(id: number,pageNo: number = 1){
    if(this.userProducts && this.previousUserProductId === id && this.previousUserProductPageNo === pageNo){
      return of(this.userProducts);
    }else{
      this.previousUserProductId = id;
      this.previousUserProductPageNo = pageNo;
      return this.http.get<UserProducts>(`${env.api_url}/products/user-products?user_id=${id}&page=${pageNo}`,this.httpOptions).pipe(
        tap(userProducts=>{
          this.userProducts =userProducts;
        })
      )
    }
  }
  getMyOrders(){
    return this.http.get<APIresponse2<Orders>>(`${env.api_url}/portfolio/my-orders`,this.httpOptions)
  }
  getMyFav(){
    return this.http.get<Favourites>(`${env.api_url}/favourites/my-favourites`,this.httpOptions)
  }
  getProviderRating(id: number){
    return this.http.get<Provider>(`${env.api_url}/rating/provider/${id}`,this.httpOptions)
  }
  addToFav(id: number){
    this.http.get<ResponseSuccess>(`${env.api_url}/favourites/add-favourite/${id}`,this.httpOptions).pipe(
      tap(()=>{
        this._refresh.next();
      })
    ).subscribe({
      next: res=>{
        this.handelRes(res)  
        this.isFavorite = true              
      },
      error: (err: HttpErrorResponse)=>{
        this.errorHandel.openErrorModa(err)
      }
    })
  }
  isFavorite: boolean = false;
  removeFav(id: number){
    this.http.get<ResponseSuccess>(`${env.api_url}/favourites/remove-favourite/${id}`,this.httpOptions).pipe(
      tap(()=>{
        this._refresh.next();
      })
    ).subscribe({
      next: res=>{
        this.handelRes(res)
        this.isFavorite = false        
      },
      error: (err: HttpErrorResponse)=>{
        this.errorHandel.openErrorModa(err)

      }
    })
  }
  getRegions(){
    if(this.regions){
      return of(this.regions)
    }else{
      return this.http.get<Regions>(`${env.api_url}/general/regions`).pipe(
        tap(regions=>{
          this.regions = regions;
        })
      )
    }
  }
  regionFilter(region_id: number,category_slug: string){
    return this.http.get<APIResponse<Products>>(`${env.api_url}/filters/get-regions-filters?region_id=${region_id}&category_slug=${category_slug}`)
  }
  search(name: string){
    return  this.http.get<APIResponse<Products>>(`${env.api_url}/products/search-products/search-with-key?key=${name}`)
  }
  getSplashScreen(){
    return this.http.get<SplashScreen>(`${env.api_url}/general/splash-screen`)
  }
  handelRes(res:any){
    this.dialogRef.open(ResponseModalComponent,{
      data: {
        response: res
      }
    })                
  }
}
