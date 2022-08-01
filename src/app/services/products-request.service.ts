import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, Subject, tap} from 'rxjs';
import { environment as env } from 'src/environments/environment';
import { Products , APIResponse , Product ,APIResponse2 , Category, CategoryFilter, NewProduct} from '../models/products.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsRequestService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    })}
    private _refresh = new Subject<void>();
    get refresh(){
      return this._refresh;
    }
  constructor(public http: HttpClient) { }

  getProductsList(categorySlug: string): Observable<APIResponse<Products>>{
    return this.http.get<APIResponse<Products>>(`${env.api_url}/products/${categorySlug}`);
  }
  getDetails(id: string): Observable<Product>{
    return this.http.get<Product>(`${env.api_url}/products/get-product-details/${id}`);
  }
  getProductsCategories(): Observable<APIResponse2<Category>>{
    return this.http.get<APIResponse2<Category>>(`${env.api_url}/categories`)
  }
  addRate(provider_id :number, desc: string, value: number){
    return this.http.post(`${env.api_url}/rating/new`,{
      provider_id: provider_id,
      desc: desc,
      value: value
    },this.httpOptions).pipe(tap(()=>{
      this._refresh.next();
    }))
  }
  setAsSolid(id: number){
    return this.http.get(`${env.api_url}/products/set-product-as-sold/${id}`,this.httpOptions).pipe(tap(()=>{
      this._refresh.next();
    }))
  }
  deleteProduct(id: number){
    return this.http.get(`${env.api_url}/products/delete-product/${id}`,this.httpOptions).pipe(tap(()=>{
      this._refresh.next();
    }))
  }
  getCategoryFilters(catergory_name: string){
    return this.http.get<CategoryFilter>(`${env.api_url}/filters/get-category-filters/${catergory_name}`,this.httpOptions)
  }
  addNewProduct(seller_phone: string,about_seller:string,
    category_id:number,name:string,desc:string,
    delivery_notes:string,price: string,owner_id:any,
    materials:string){
      return this.http.post<NewProduct>(`${env.api_url}/products/store-new-product`,{
        seller_phone,about_seller,
        category_id,name,
        desc,delivery_notes,
        price,owner_id,
        materials
      }
      ,this.httpOptions)
  }
}
