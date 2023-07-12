import { Injectable } from '@angular/core';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class GoBackService {

  constructor(private location: Location) { }
  goBack(){
    window.addEventListener('popstate', () => {
      this.location.back();
    });
  }
}
