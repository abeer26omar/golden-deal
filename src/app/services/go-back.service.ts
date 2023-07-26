import { Injectable } from '@angular/core';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class GoBackService {
  goBackState: boolean = false;
  currentRoute!: string;
  previousRoute!: string;
  previousElementId: any;
  urlSerializer: any;
  categorySlug!: any;
  pageNumber: any = 1;
  active: any;
  active_subBrand: any;
  carPlateType: any;
  townFilter: any;
  region_filter: any; 
  brand_name: any;
  sub_brand_name: any;
  filterBrandKey: any;
  selectedSlideIndex: any; 
  constructor(private location: Location) {}
  getElement(element: HTMLElement| null){
    this.previousElementId = element?.id;    
  }
  getFragments(category_slug?: any,
    page_num?: any,
    carPlateType?: any,
    townFilter?: any,
    brandFilter?: any,
    brandSubFilter?: any,
    regionFilter?: any,
    filterBrandKey?: any,
    selectedSlideIndex?: any){
    this.categorySlug = category_slug;
    this.pageNumber = page_num;
    this.carPlateType = carPlateType;
    this.townFilter = townFilter;
    this.region_filter = regionFilter;
    this.brand_name = brandFilter;
    this.sub_brand_name =  brandSubFilter;
    this.filterBrandKey = filterBrandKey;
    this.selectedSlideIndex = selectedSlideIndex;
  }
  goBack(){
    this.currentRoute = this.location.path();
    this.location.onUrlChange((url: string, state: unknown) => {
      this.previousRoute = this.currentRoute;
      this.currentRoute = url;      
    });
    window.addEventListener('popstate', () => {
      if(this.previousRoute.includes('/product-details')){ 
        this.goBackState = true;
        this.goBackToPreviousElement()
      }else{
        this.goBackState = false;
      }
    });
  }
  goBackToPreviousElement() {
    if (this.previousElementId) {
      setTimeout(() => {
        const element = document.getElementById(this.previousElementId);
        if (element) {
          const rect = element.getBoundingClientRect();
          const scrollTop = window.scrollY || document.documentElement.scrollTop;
          const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
          const topOffset = rect.top + scrollTop;
          const bottomOffset = topOffset + rect.height;
          const centerY = topOffset - (window.innerHeight - rect.height) / 2;
          const scrollY = centerY - window.innerHeight / 2;
          const scrollTarget = Math.min(
            Math.max(scrollTop + scrollY, 0),
            document.documentElement.scrollHeight - window.innerHeight
          );
          if (scrollTarget !== scrollTop) {
            window.scrollTo(scrollLeft, scrollTarget);
            element.scrollIntoView({ block: 'center' , behavior: 'smooth'});
          }
        }
      }, 100);
    }
  }
}