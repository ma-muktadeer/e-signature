import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonService } from '../softcafe/common/common.service';

@Injectable({
  providedIn: 'root'
})
export class SignatureAgreementGuard implements CanActivate {
  constructor(private cs: CommonService, private router: Router) {
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const user = this.cs.loadLoginUser();
    debugger
     if(!user.userId){
      return this.router.createUrlTree(['/login']);
      // return false;
    }
    else if (user?.userType === 'EXTERNAL_USER' && !localStorage.getItem('agreement')) {
      return true;
    }
    // else if (user && user?.userType === 'EXTERNAL_USER' && !localStorage.getItem('agreement')) {
    //   this.router.navigate(['/signature/agreement']);
    //   return false;
    // } 
    
    // else {
    //   return this.router.createUrlTree(['/signature/agreement']);
    //   // return false;
    // }

   return true
    
  }

}
