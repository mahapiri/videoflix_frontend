import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }

  private _isNavbarSubject = new BehaviorSubject<boolean>(true);
  isNavbar$ = this._isNavbarSubject.asObservable();

  private _isFooterSubject = new BehaviorSubject<boolean>(true);
  isFooter$ = this._isFooterSubject.asObservable();

  private _isPrivacySubject = new BehaviorSubject<boolean>(false);
  isPrivacy$ = this._isPrivacySubject.asObservable();

  setIsNavbar(status: boolean) {
    this._isNavbarSubject.next(status)
  }

  setIsFooter(status: boolean) {
    this._isFooterSubject.next(status)
  }

  setIsPrivacy(status: boolean) {
    this._isPrivacySubject.next(status)
  }

}
