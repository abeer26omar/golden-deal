import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClearStorageService {

  constructor() { }
  removeTokenAfterOneHour() {
    const loginTime = Number(localStorage.getItem('loginTime'));
    const currentTime = new Date().getTime();
    const elapsed = currentTime - loginTime;
    const oneHourInMillis = 24 * 60 * 60 * 1000; // 1 hour in milliseconds

    if (elapsed >= oneHourInMillis) {
      // Remove the token from localStorage
      localStorage.removeItem('token_deal');
      localStorage.removeItem('userId');
      localStorage.removeItem('region_id');
      localStorage.removeItem('userImage');
      localStorage.removeItem('loginTime');
    } else {
      // Schedule the removal after the remaining time
      const remainingTime = oneHourInMillis - elapsed;
      setTimeout(() => {
        // Remove the token from localStorage after the remaining time
        localStorage.removeItem('token_deal');
        localStorage.removeItem('userId');
        localStorage.removeItem('region_id');
        localStorage.removeItem('userImage');
        localStorage.removeItem('loginTime');
      }, remainingTime);
    }
  }

  storeTimestampOnClose() {
    const currentTime = new Date().getTime();
    localStorage.setItem('closeTime', currentTime.toString());
  }

  calculateElapsedTime() {
    const closeTime = Number(localStorage.getItem('closeTime'));
    const currentTime = new Date().getTime();
    const elapsed = currentTime - closeTime;
    return elapsed;
  }    
}
