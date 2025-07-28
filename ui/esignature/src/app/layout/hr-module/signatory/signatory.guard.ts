import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AppPermission, PermissioinStoreService } from 'src/app/service/permissioin-store.service';
import { CommonService } from 'src/app/softcafe/common/common.service';

@Injectable({
  providedIn: 'root'
})
export class SignatoryGuard implements CanActivate {
  private appPermission = AppPermission;
  constructor(private ps: PermissioinStoreService, private router: Router, private cs: CommonService) {

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const userType = this.cs.loadLoginUser()?.userType;
    if (userType == 'INTERNAL_USER' && this.ps.hasPermission(this.appPermission.SIGNATORY_VIEWER)) {
      return true;
    }
    return this.router.parseUrl('/not-found');
  }

}
