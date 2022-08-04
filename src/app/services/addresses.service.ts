import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { environment as env } from 'src/environments/environment';
import { Address, Addresses, APIResponse } from '../models/user.model';
import { Subject, tap } from 'rxjs';
import { ResponseSuccess } from '../models/actions.model';

@Injectable({
  providedIn: 'root'
})
export class AddressesService {

  constructor(private http: HttpClient) { }
  private _refresh = new Subject<void>();
  get refresh(){
    return this._refresh;
  }
  httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    })}
  getAllAddresses(){
    return this.http.get<APIResponse<Addresses>>(`${env.api_url}/address/info`
    ,this.httpOptions)
  }
  getAddress(id: number){
    return this.http.get<Address>(`${env.api_url}/address/address-details/${id}`,this.httpOptions)
  }
  addNewAddress(title: string,address_type: string,city:string,street:string,building:string){
    return this.http.post<ResponseSuccess>(`${env.api_url}/address/store`,{
      title:title,
      address_type: address_type,
      city:city,
      street:street,
      building:building
    }, this.httpOptions).pipe(tap(()=>{
      this._refresh.next();
    }))
  }
  updateAddress(address_id: number,title: string,address_type: string,city: string,street: string,building: string){
    return this.http.post<ResponseSuccess>(`${env.api_url}/address/update`,{
      address_id: address_id,
      title: title,
      address_type: address_type,
      city: city,
      street: street,
      building: building
    },this.httpOptions).pipe(tap(()=>{
      this._refresh.next();
    }))
  }
  deleteAdd(id:number){
    return this.http.get<ResponseSuccess>(`${env.api_url}/address/delete/${id}`,this.httpOptions).pipe(tap(()=>{
      this._refresh.next();
    }))
  }
  setPrimary(id: number){
    return this.http.get<ResponseSuccess>(`${env.api_url}/address/set-primary/${id}`,this.httpOptions).pipe(tap(()=>{
      this._refresh.next();
    }))
  }
}
