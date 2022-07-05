import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable} from 'rxjs';
import { environment as env } from 'src/environments/environment';
import { Products , APIResponse , Product ,APIResponse2 , Category} from '../products';

@Injectable({
  providedIn: 'root'
})
export class ProductsRequestService {

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
  sendRate(provider_id :number, desc: string, value: number){
    return this.http.post(`${env.api_url}/rating/new`,{
      provider_id: provider_id,
      desc: desc,
      value: value
    })
  }
  searchProducts(searchKey: string): Observable<APIResponse<Products>>{
    return this.http.get<APIResponse<Products>>(`${env.api_url}/products/search-products/search-with-key?key=${searchKey}`);
  }
}
