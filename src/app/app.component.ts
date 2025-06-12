import { Component } from '@angular/core';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterOutlet } from '@angular/router';
import { StartComponent } from './pages/start/start.component';
import { FooterComponent } from './footer/footer.component';
import { CommonModule } from '@angular/common';
import { SharedService } from './services/shared.service';
import { ErrorComponent } from './error/error.component';

@Component({
  selector: 'app-root',
  imports: [
    NavbarComponent,
    RouterOutlet,
    FooterComponent,
    CommonModule,
    ErrorComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'videoflix_frontend';

  constructor(
    public sharedService: SharedService
  ) { }

}
