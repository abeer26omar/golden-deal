import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable, Subject, of, tap} from 'rxjs';
import { environment as env } from 'src/environments/environment';
import { Adds , APIResponse3} from '../models/products.model';
import { APIResponse4, Pages } from '../models/user.model'

@Injectable({
  providedIn: 'root'
})
export class HomeAddsService {
  private _refresh = new Subject<void>();
  get refresh(){
    return this._refresh;
  }
  addsInfo!: APIResponse3<Adds>;
  staticInfo!: APIResponse4<Pages>;
  constructor(private http: HttpClient) { }
  getAdds():Observable<APIResponse3<Adds>>{
    if(this.addsInfo){
      return of(this.addsInfo)
    }else{
      return this.http.get<APIResponse3<Adds>>(`${env.api_url}/ads`).pipe(
        tap(adds=>{
          this.addsInfo = adds;
        })
      )
    }
  }
  getStaticPages(): Observable<APIResponse4<Pages>>{
    if(this.staticInfo){
      return of(this.staticInfo);
    }else{
      return this.http.get<APIResponse4<Pages>>(`${env.api_url}/static-pages/get-static-pages`).pipe(
      tap((info) => {
        this.staticInfo = info;
        this._refresh.next();
      }))
    }
  }
}
