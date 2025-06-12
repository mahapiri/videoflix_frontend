import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-imprint',
  imports: [],
  templateUrl: './imprint.component.html',
  styleUrl: './imprint.component.scss'
})
export class ImprintComponent implements OnInit, OnDestroy {

  constructor(
    private sharedService: SharedService
  ) {
    this.sharedService.setIsPrivacy(true);
    this.sharedService.setIsFooter(false);
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.sharedService.setIsPrivacy(false);
    this.sharedService.setIsFooter(true);
  }
}
