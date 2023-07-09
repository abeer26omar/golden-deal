import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'input'
})
export class InputPipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): unknown {
    let arr = value.split('');
    return arr.join('\u00A0');
  }

}
