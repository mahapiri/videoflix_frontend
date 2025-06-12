import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
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
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor(
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef
  ) {
    this.sharedService.setIsNavbar(false);
    this.sharedService.setIsFooter(false);
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    this.sharedService.setIsNavbar(true);
    this.sharedService.setIsFooter(true);
    this.cdr.detectChanges();
  }
}
