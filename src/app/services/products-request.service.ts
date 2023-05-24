import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, Subject, tap} from 'rxjs';
import { environment as env } from 'src/environments/environment';
import { Products , APIResponse , Product ,
  APIResponse2 , Category, CategoryFilter, NewProduct, EditProduct, APIResponse4, EditProductFilters, Update, APIResponse5, Search,BrandFilter, Category_Filter} from '../models/products.model';
import { ResponseSuccess } from '../models/actions.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsRequestService {
  httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token_deal')}`
    })}
    private _refresh = new Subject<void>();
    get refresh(){
      return this._refresh;
    }
  constructor(public http: HttpClient) { }

  getProductsList(categorySlug: string, pageNo: number): Observable<APIResponse<Products>>{
    return this.http.get<APIResponse<Products>>(`${env.api_url}/products/${categorySlug}?page=${pageNo}`,this.httpOptions).pipe(tap(()=>{
      this._refresh.next();
    }))
  }
  getDetails(id: string): Observable<Product>{
    return this.http.get<Product>(`${env.api_url}/products/get-product-details/${id}`, this.httpOptions);
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
    return this.http.get<ResponseSuccess>(`${env.api_url}/products/set-product-as-sold/${id}`,this.httpOptions).pipe(tap(()=>{
      this._refresh.next();
    }))
  }
  deleteProduct(id: number){
    return this.http.get<ResponseSuccess>(`${env.api_url}/products/delete-product/${id}`,this.httpOptions).pipe(tap(()=>{
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
    return this.http.post<APIResponse<Products>>(`${env.api_url}/filters/submit-filters`,body
    ,this.httpOptions).pipe(tap(()=>{
      this._refresh.next();
    }))
  }
  applayFilterKeys(valueMin: any,valueMax: any,brand_filter?: string, 
    brand_Subfilter?: string, 
    town_filter?: string,
    plate_type_filter?: string,
    plate_category_filter?: string,
    page_num?: number){
    return this.http.post<APIResponse<Products>>(`${env.api_url}/filters/submit-filters?page=${page_num}`,
    {
      min_price: valueMin,
      max_price: valueMax,
      car_brand_filter_1: brand_filter,
      car_class_sub_filter_1: brand_Subfilter,
      plate_town_filter_6: town_filter,
      plate_type_filter_6: plate_type_filter,
      plate_category_filter_6: plate_category_filter
    },this.httpOptions).pipe(tap(()=>{
      this._refresh.next();
    }))
  }
  applayForPagination(valueMin: any,valueMax: any,brand_filter?: string, 
    brand_Subfilter?: string, 
    page_num?: number){
    return this.http.post<APIResponse<Products>>(`${env.api_url}/filters/submit-filters?page=${page_num}`,
    {
      min_price: valueMin,
      max_price: valueMax,
      car_brand_filter_1: brand_filter,
      car_class_sub_filter_1: brand_Subfilter,
    },this.httpOptions).pipe(tap(()=>{
      this._refresh.next();
    }))
  }
  applayForCar_plates(valueMin: any,valueMax: any,town_filter?: string, 
    plate_type_filter?: string, 
    page_num?: number){
    return this.http.post<APIResponse<Products>>(`${env.api_url}/filters/submit-filters?page=${page_num}`,
    {
      min_price: valueMin,
      max_price: valueMax,
      plate_town_filter_6: town_filter,
      plate_type_filter_6: plate_type_filter,
    },this.httpOptions).pipe(tap(()=>{
      this._refresh.next();
    }))
  }
  searchResult(key: string, pageNo?: number){
    return this.http.get<APIResponse<Products>>(`${env.api_url}/products/search-products/search-with-key?key=${key}&page=${pageNo}`,this.httpOptions).pipe(tap(()=>{
      this._refresh.next();
    }))
  }
  getBrandFilters(){
    return this.http.get<BrandFilter>(`${env.api_url}/get-cars-brands`,this.httpOptions)
  }
  getCategoryFilter(category_slug: string){
    return this.http.get<Category_Filter>(`${env.api_url}/filters/get-category-filters/${category_slug}`,this.httpOptions)
  }
  applayBarndFilter(filter_id: number){
    return this.http.get<APIResponse<Products>>(`${env.api_url}/filters/get-sub-filter-options?filter_option_id=${filter_id}`,
    this.httpOptions).pipe(tap(()=>{
      this._refresh.next();
    }))
  }
  getCloseProducts(region_id: any,category_slug: string){
    return this.http.get<APIResponse<Products>>(`${env.api_url}/filters/get-regions-filters?region_id=${region_id}&category_slug=${category_slug}`)
  }
} 
