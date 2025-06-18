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

  private _isFullscreenSubject = new BehaviorSubject<boolean>(false);
  isFullscreen$ = this._isFullscreenSubject.asObservable();

  // private _videoSourceSubject = new BehaviorSubject<string>('');
  // videoSource$ = this._videoSourceSubject.asObservable();

  setIsNavbar(status: boolean) {
    this._isNavbarSubject.next(status)
  }

  setIsFooter(status: boolean) {
    this._isFooterSubject.next(status)
  }

  setIsPrivacy(status: boolean) {
    this._isPrivacySubject.next(status)
  }

  setIsFullscreen(status: boolean) {
    this._isFullscreenSubject.next(status)
  }

  // setVideoSource(source: string) {
  //   this._videoSourceSubject.next(source);
  // }
}
