import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-footer',
  imports: [
    RouterLink,
    CommonModule
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  constructor(
    public sharedService: SharedService
  ) { }
}
