import { HostListener, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClearStorageService {

  constructor() { 
    window.addEventListener('unload', () => {
      console.log('jdkdjkdkjf');
      localStorage.setItem('pageLoaded_deal', 'true');
    });
  }
    @HostListener('window:beforeunload', ['$event'])
    listenForBeforeUnload() {
      const pageLoad = localStorage.getItem('pageLoaded_deal')
    if (pageLoad) {
      localStorage.clear();
    }
  }
}
