import { Injectable } from '@angular/core';
import { HttpClient, HttpParams} from '@angular/common/http';
import { Observable} from 'rxjs';
import { environment as env } from 'src/environments/environment';
import { Products , APIResponse ,  Product} from '../products';

@Injectable({
  providedIn: 'root'
})
export class ProductsRequestService {

  constructor(private http: HttpClient) { }

  getProductsList(sort: string, search?: string): Observable<APIResponse<Products>>{
    let params = new HttpParams().set('sort', sort);
      if(search){
        params = new HttpParams().set('sort', sort).set('search', search)
      }
    return this.http.get<APIResponse<Products>>(`${env.api_url}/products/all`, {params: params});
  }
  
  getDetails(id: string): Observable<Product>{
    return this.http.get<Product>(`${env.api_url}/products/get-product-details/${id}`);
  }

  sendRate(provider_id :number, desc: string, value: number){
    return this.http.post(`${env.api_url}/rating/new`,{
      provider_id: provider_id,
      desc: desc,
      value: value
    })
  }
}
