import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FooterComponent } from '../../footer/footer.component';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {

  constructor(
    private sharedService: SharedService
  ) {
    this.sharedService.setIsDashboard(true);
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.sharedService.setIsDashboard(false);
  }
}
