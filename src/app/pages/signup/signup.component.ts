import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidationService } from '../../services/validation.service';

@Component({
  selector: 'app-signup',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  form: FormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  signupFailed: boolean = false;


  constructor(
    private fb: FormBuilder,
    private validate: ValidationService
  ) {
    this.form = this.fb.group({
      email: new FormControl('', [Validators.required, this.validate.validateEmail]),
      password: new FormControl('', [Validators.required, this.validate.validatePassword]),
      confirmPassword: new FormControl('', [Validators.required]),
    }, {
      validators: this.validate.passwordMatchValidator()
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
    this.submitted = false;
    this.signupFailed = false;
  }


  register() {
    this.submitted = true;
    if (this.form.valid) {
      this.loading = true;
      const email = this.form.get('email')?.value;
      const password = this.form.get('password')?.value;
      console.log("API: Send Login");
      setTimeout(() => {
        this.loading = false;
        this.form.reset();
        this.submitted = false;
      }, 2000); // if response successed
      setTimeout(() => {
        this.signupFailed = true;
      }, 3000);  // if response failed
    }
  }

  hasEmailError() {
    const email = this.form.get('email');
    return email?.invalid && email?.touched && this.submitted
  }


  hasPasswordError() {
    const password = this.form.get('password');
    return password?.invalid && password?.touched && this.submitted
  }

  
  hasPasswordMatchError() {
    return (this.form.hasError('passwordMismatch') && this.form.get('confirmPassword')?.touched)
  }


  showSignupError() {
    return this.submitted && this.signupFailed;
  }


  proofDisableBtn(): boolean {
    const password = this.form.get('password')?.value || '';
    const confirmPassword = this.form.get('confirmPassword')?.value || '';
    const email = this.form.get('email')?.value || '';
    return this.loading || (password.length < 1 || email.length < 1 || confirmPassword.length < 1);
  }
}
