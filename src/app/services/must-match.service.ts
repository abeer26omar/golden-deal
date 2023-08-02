import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';


@Injectable({
  providedIn: 'root'
})
export class MustMatchService {
  mustMatch(controlName: string, matchingControlName: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const password = control.get(controlName);
      const confirmPassword = control.get(matchingControlName);
      if (password && confirmPassword && password.value !== confirmPassword.value) {
        confirmPassword?.setErrors({ mustMatch: true });
        return { mustMatch: true };
      } else {
        return null;
      }
    };
  }
  nonZero(controlName: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const phone = control.get(controlName);
      if (phone?.value && phone.value.toString().startsWith('0')) {
        phone?.setErrors({ nonZero: true });
        return { nonZero: true };
      } else {
        return null;
      }
    }
  }
  constructor() { }
}
