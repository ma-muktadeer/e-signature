import { Injectable, ErrorHandler } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandlerService implements ErrorHandler {

  constructor() { }

  handleError(error: Error | HttpErrorResponse) {
    debugger
    console.log('GlobalErrorHandlerService')
    console.error(error);
  }
}
