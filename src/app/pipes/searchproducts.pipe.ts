import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchproducts'
})
export class SearchproductsPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
