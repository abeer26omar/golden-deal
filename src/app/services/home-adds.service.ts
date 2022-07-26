import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable, Subject, tap} from 'rxjs';
import { environment as env } from 'src/environments/environment';
import { Adds , APIResponse3} from '../products';
import { APIResponse4, Pages } from '../user.model'

@Injectable({
  providedIn: 'root'
})
export class HomeAddsService {
  private _refresh = new Subject<void>();
  get refresh(){
    return this._refresh;
  }
  constructor(private http: HttpClient) { }
  getAdds():Observable<APIResponse3<Adds>>{
    return this.http.get<APIResponse3<Adds>>(`${env.api_url}/ads`);
  }
  getStaticPages(): Observable<APIResponse4<Pages>>{
    return this.http.get<APIResponse4<Pages>>(`${env.api_url}/static-pages/get-static-pages`).pipe(
    tap(() => {
      this._refresh.next();
    }))
  }
}
