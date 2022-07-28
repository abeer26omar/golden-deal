import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, Subject, tap} from 'rxjs';
import { environment as env } from 'src/environments/environment';
import { Products , APIResponse , Product ,APIResponse2 , Category} from '../models/products.model';

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
  constructor(private http: HttpClient) { }

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
}
