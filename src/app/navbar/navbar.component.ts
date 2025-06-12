import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    CommonModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  constructor(
    public sharedService: SharedService,
    private location: Location
  ) { }

  back() {
    this.location.back();
  }
}
