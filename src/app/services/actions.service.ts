import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { environment as env } from 'src/environments/environment';
import { map, Observable, Subject, tap } from 'rxjs';
import { APIresponse, APIresponse2, Favourites, Orders, Portfolio, Provider, ResponseSuccess, Subscriptions } from '../models/actions.model';
import { APIResponse, Products } from '../models/products.model';
import { MatDialog } from '@angular/material/dialog';
import { ResponseModalComponent } from '../response-modal/response-modal.component';

@Injectable({
  providedIn: 'root'
})
export class ActionsService {
  constructor(private http: HttpClient,
    private dialogRef: MatDialog) { }
  private _refresh = new Subject<void>();
  get refresh(){
    return this._refresh;
  }
  httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    })
  }
  getSubscribtionsType(){
    return this.http.get<APIresponse<Subscriptions>>(`${env.api_url}/subscriptions/get-types`,this.httpOptions)
  }
  getPortfolio(id: number){
    return this.http.get<Portfolio>(`${env.api_url}/portfolio/user/${id}`,this.httpOptions)
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
        this.dandelRes(res)        
      },
      error:(err:HttpErrorResponse)=>{
        this.dandelRes(err)
      }
    })
  }
  removeFav(id: number){
    this.http.get<ResponseSuccess>(`${env.api_url}/favourites/remove-favourite/${id}`,this.httpOptions).pipe(
      tap(()=>{
        this._refresh.next();
      })
    ).subscribe({
      next: res=>{
        this.dandelRes(res)        
      },
      error:(err:HttpErrorResponse)=>{
        this.dandelRes(err)
      }
    })
  }
  search(name: string){
  return  this.http.get<APIResponse<Products>>(`${env.api_url}/products/search-products/search-with-key?key=${name}`)
  }
  dandelRes(res:any){
    this.dialogRef.open(ResponseModalComponent,{
      data: {
        response: res
      }
    })                
  }
}
