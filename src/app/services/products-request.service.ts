import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, Subject, tap} from 'rxjs';
import { environment as env } from 'src/environments/environment';
import { Products , APIResponse , Product ,
  APIResponse2 , Category, CategoryFilter, NewProduct, EditProduct, APIResponse4, EditProductFilters, Update, APIResponse5, Search} from '../models/products.model';
import { ResponseSuccess } from '../models/actions.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsRequestService {
  httpOptions = {
    headers: new HttpHeaders({
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
    return this.http.post<ResponseSuccess>(`${env.api_url}/rating/new`,{
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
  addNewProduct(body: any){
      return this.http.post<NewProduct>(`${env.api_url}/products/store-new-product`,body
      ,this.httpOptions)
  }
  getEditAddInfo(id: number){
    return this.http.get<EditProduct>(`${env.api_url}/products/edit-product-info/${id}`,this.httpOptions).pipe(tap(()=>{
      this._refresh.next();
    }))
  }
  getEditFilters(id: number, category: string){
    return this.http.get<APIResponse4<EditProductFilters>>(`${env.api_url}/filters/edit-product-filters-info/${id}/${category}`,this.httpOptions).pipe(tap(()=>{
      this._refresh.next();
    }))
  }
  updateAdd(id: number,body: any){
    return this.http.post<Update>(`${env.api_url}/products/update-product/${id}`,
    body,this.httpOptions).pipe(tap(()=>{
      this._refresh.next();
    }))
  }
  applayFilter(body: any){
    return this.http.post<ResponseSuccess>(`${env.api_url}/filters/submit-filters`,
    body,this.httpOptions).pipe(tap(()=>{
      this._refresh.next();
    }))
  }
  searchResult(key: string){
    return this.http.get<APIResponse5<Search>>(`${env.api_url}/products/search-products/search-with-key?key=${key}`,this.httpOptions).pipe(tap(()=>{
      this._refresh.next();
    }))
  }
}
