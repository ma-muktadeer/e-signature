import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileImageService {

  private methodCallSourch = new Subject<void>();

  methodCall$ = this.methodCallSourch.asObservable();

  callMethodInComponent(){
    this.methodCallSourch.next();
  }
}
