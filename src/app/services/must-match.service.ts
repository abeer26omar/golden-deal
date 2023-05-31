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
        confirmPassword?.setErrors(null);        
        return null;
      }
    };
  }
  constructor() { }
}
