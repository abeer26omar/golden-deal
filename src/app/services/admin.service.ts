import { Injectable } from '@angular/core';

interface Admin{
  admin_details: {
      cover_url: string,
      id: number,
      image: string,
      image_url: string,
      name: string,
      phone: string
  }
}
@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private admin = {};
    constructor(){}

  setOption(data: Admin) {      
    this.admin = data;  
  }  
  getOption() {  
    return this.admin;  
  }  
}
