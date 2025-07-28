import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AppPermission, PermissioinStoreService } from 'src/app/service/permissioin-store.service';
import { CommonService } from 'src/app/softcafe/common/common.service';

@Injectable({
  providedIn: 'root'
})
export class ESignatureGuard implements CanActivate {
  constructor(private permission: PermissioinStoreService, private router: Router, private cs: CommonService) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const userType = this.cs.loadLoginUser()?.userType;
    debugger
    console.log(route);
    if (route.routeConfig.path === 'upload') {
      return (userType == 'INTERNAL_USER' && this.permission.hasAnyPermission([AppPermission.SIGNATORY_MAKER])) ? true : this.navigateTo('/access-denied');
    }
    else if (route.routeConfig.path.search('signature-view')>0) {
      if(this.cs.forceAllow()){
        return true;
      }
      else if ((userType === 'EXTERNAL_USER' && localStorage.getItem('agreement')) || userType != 'EXTERNAL_USER') {
        return true;
      }
      else if (userType === 'EXTERNAL_USER' && !localStorage.getItem('agreement')) {
        // this.router.navigate(['/signature/agreement']);
        // return false;
        return this.router.parseUrl('/signature/agreement');
      }
      return false
    } 
    else if (route.routeConfig.path === 'signature-list') {
      return userType == 'INTERNAL_USER' && this.permission.hasAnyPermission([AppPermission.SIGNATURE_VIEWER]) ? true : this.navigateTo('/access-denied');
    } 
    else if (route.routeConfig.path === '/signature/upload') {
      return userType == 'INTERNAL_USER' && this.permission.hasAnyPermission([AppPermission.UPLOAD_SIGNATURE]) ? true : this.navigateTo('/access-denied');
    } 
    else {
      return false;
    }
    // return true;

  }
  navigateTo(link: string): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    // this.router.navigate([link]);
    return this.router.parseUrl(link);
    // return false;
  }

}
