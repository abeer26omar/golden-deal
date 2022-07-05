import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { from, Observable} from 'rxjs';
import { environment as env } from 'src/environments/environment';
import { Adds , APIResponse3} from '../products';

@Injectable({
  providedIn: 'root'
})
export class HomeAddsService {

  constructor(private http: HttpClient) { }
  getAdds():Observable<APIResponse3<Adds>>{
    return this.http.get<APIResponse3<Adds>>(`${env.api_url}/ads`);
  }
}
