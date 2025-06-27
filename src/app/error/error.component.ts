import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-error',
  imports: [],
  templateUrl: './error.component.html',
  styleUrls: [
    './error.component.scss',
    './error-responsive.component.scss',
  ]
})
export class ErrorComponent {

  constructor(
    private apiService: ApiService,
  ) {

  }

  close() {
    this.apiService.setIsError(false);
  }

  sendApiRequest() {
    this.apiService.setIsError(false);
  }
}
