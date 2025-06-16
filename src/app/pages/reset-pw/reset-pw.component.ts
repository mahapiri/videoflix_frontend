import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidationService } from '../../services/validation.service';

@Component({
  selector: 'app-reset-pw',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './reset-pw.component.html',
  styleUrl: './reset-pw.component.scss'
})
export class ResetPwComponent {
  form: FormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  resetFailed: boolean = false;


  constructor(
    private fb: FormBuilder,
    private validate: ValidationService
  ) {
    this.form = this.fb.group({
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
    };
    this.resetForm();
  }


  resetForm() {
    this.submitted = false;
    this.resetFailed = false;
  }

  
  resetPW() {
    this.submitted = true;
    if (this.form.valid) {
      this.loading = true;
      const password = this.form.get('password')?.value;
      console.log("API: Reset PW");
      setTimeout(() => {
        this.loading = false;
        this.form.reset();
        this.submitted = false;
      }, 2000); // if response successed
      setTimeout(() => {
        this.resetFailed = true;
      }, 3000);  // if response failed
    }
  }


  hasPasswordError() {
    const password = this.form.get('password');
    return password?.invalid && password?.touched && this.submitted
  }


  hasPasswordMatchError() {
    return (this.form.hasError('passwordMismatch') && this.form.get('confirmPassword')?.touched)
  }


  showResetPWError() {
    return this.submitted && this.resetFailed;
  }


  proofDisableBtn(): boolean {
    const password = this.form.get('password')?.value || '';
    const confirmPassword = this.form.get('confirmPassword')?.value || '';
    return this.loading || (password.length < 1 || confirmPassword.length < 1);
  }
}
