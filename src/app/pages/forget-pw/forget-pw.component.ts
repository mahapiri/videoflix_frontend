import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidationService } from '../../services/validation.service';

@Component({
  selector: 'app-forget-pw',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './forget-pw.component.html',
  styleUrl: './forget-pw.component.scss'
})
export class ForgetPwComponent {
  form: FormGroup;
  submitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private validate: ValidationService
  ) {
    this.form = this.fb.group({
      email: new FormControl('', [Validators.required, this.validate.validateEmail])
    })
  }

  resetForm() {
    this.form.get('email')?.markAsUntouched();
    if (this.form.get('email')?.value.length == 0) {
      this.submitted = false;
    }
  }

  sendEmail() {
    console.log("klick")
    this.submitted = true;

    if (this.form.valid) {
      const email = this.form.get('email')?.value;
      console.log("API: Send Email")
      this.form.reset() // sobald erfolgreich
      this.submitted = false;
    }
  }

  hasEmailError() {
    return this.form.get('email')?.invalid && 
           this.form.get('email')?.touched && 
           this.form.get('email')?.value.length > 0 && 
           this.submitted
  }
}
