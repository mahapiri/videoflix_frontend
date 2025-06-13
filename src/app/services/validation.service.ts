import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }


  validatePassword(control: AbstractControl): ValidationErrors | null {
    const passwordRegex = /^(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?/~\-]).{8,}$/;

    if (!control.value) {
      return null;
    }

    return passwordRegex.test(control.value) ? null : { invalidPassword: true };
  }


  passwordMatchValidator(): ValidatorFn {
    return (form: AbstractControl): ValidationErrors | null => {
      const group = form as FormGroup;
      const password = group.get('password')?.value;
      const confirmPassword = group.get('confirmPassword')?.value;
      return password === confirmPassword ? null : { passwordMismatch: true };
    };
  }


  validateEmail(control: AbstractControl): ValidationErrors | null {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!control.value) {
      return null;
    }

    return emailRegex.test(control.value) ? null : { invalidEmail: true };
  }
}
