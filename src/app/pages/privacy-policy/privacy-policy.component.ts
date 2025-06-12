import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-privacy-policy',
  imports: [],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss'
})
export class PrivacyPolicyComponent implements OnInit, OnDestroy {
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
