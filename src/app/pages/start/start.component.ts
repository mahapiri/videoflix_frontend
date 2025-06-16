import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidationService } from '../../services/validation.service';

@Component({
  selector: 'app-start',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './start.component.html',
  styleUrl: './start.component.scss'
})
export class StartComponent {
  form: FormGroup;
  submitted: boolean = false;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private validate: ValidationService
  ) {
    this.form = this.fb.group({
      email: new FormControl('', [Validators.required, this.validate.validateEmail])
    })
  }

  resetIsSubmitted() {
    this.submitted = false;
  }

  signup() {
    this.submitted = true;

    if (this.form.valid) {
      this.loading = true;
      const email = this.form.get('email')?.value;
      console.log("API: SIGNUP")
      // this.loading = false;   //sobald ausgeführt
    }
  }
}
