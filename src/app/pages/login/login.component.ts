import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ValidationService } from '../../services/validation.service';

@Component({
  selector: 'app-login',
  imports: [
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  form: FormGroup;
  submitted: boolean = false;
  loginFailed: boolean = false;

  constructor(
    private fb: FormBuilder,
    private validate: ValidationService
  ) {
    this.form = this.fb.group({
      email: new FormControl('', [Validators.required, this.validate.validateEmail]),
      password: new FormControl('', [Validators.required])
    })
  }

  passwordOnFocus(inputElement: HTMLInputElement, imgElement: HTMLImageElement) {
    this.updateIcon(inputElement, imgElement);
  }


  passwordNotOnFocus(inputElement: HTMLInputElement, imgElement: HTMLImageElement) {
    if (inputElement.value.length === 0) {
      imgElement.src = '/assets/img/icons/lock.svg';
    }
  }


  togglePassword(inputElement: HTMLInputElement, imgElement: HTMLImageElement) {
    inputElement.type = inputElement.type === 'password' ? 'text' : 'password';
    this.updateIcon(inputElement, imgElement);
  }


  updateIcon(inputElement: HTMLInputElement, imgElement: HTMLImageElement) {
    if (inputElement.type === 'password') {
      imgElement.src = '/assets/img/icons/visibility_off.svg';
      imgElement.alt = 'Password Visibility Off';
    } else {
      imgElement.src = '/assets/img/icons/visibility.svg';
      imgElement.alt = 'Password Visibility On';
    }
    this.resetForm();
  }

  
  resetForm() {
    this.loginFailed = false;
  }


  login() {
    console.log("klick")
    this.submitted = true;
    if (this.form.valid) {
      const email = this.form.get('email')?.value;
      const password = this.form.get('password')?.value;
      console.log("API: Send Login");
      this.loginFailed = true;
    }
  }


  hasEmailError() {
    const email = this.form.get('email');
    return (email?.invalid && email?.touched) ||
      (this.submitted && this.loginFailed);
  }


  hasPasswordError() {
    const password = this.form.get('password');
    return (password?.invalid && password?.touched) ||
      (this.submitted && this.loginFailed);
  }


  showEmailFormatError() {
    const email = this.form.get('email');
    return email?.invalid && email?.touched && !this.loginFailed;
  }


  showLoginError() {
    return this.submitted && this.loginFailed;
  }
}
