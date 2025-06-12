import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private _isError = new BehaviorSubject<boolean>(false);
  isError$ = this._isError.asObservable();

  constructor() { 
    this._isError.next(true)
  }

  setIsError(status: boolean) {
    this._isError.next(status);
  }
}
