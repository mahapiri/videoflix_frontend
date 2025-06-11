import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }

  private _isDashboardSubject = new BehaviorSubject<boolean>(false);
  isDashboard$ = this._isDashboardSubject.asObservable();

  setIsDashboard(status: boolean) {
    this._isDashboardSubject.next(status)
  }
}
