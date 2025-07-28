import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AppPermission, PermissioinStoreService } from 'src/app/service/permissioin-store.service';
import { CommonService } from 'src/app/softcafe/common/common.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardGuard implements CanActivate {
  private appPermission = AppPermission;

  constructor(private cs: CommonService, private router: Router, private permission: PermissioinStoreService) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const user = this.cs.loadLoginUser();
    console.log(user);
    debugger
    if(this.cs.getAgreement()){
      if(!this.permission.hasPermission(this.appPermission.VIEW_DASHBOARD)){
        return this.router.createUrlTree(['/news-feeds']);
      }
      if (user.userType === 'INTERNAL_USER' || user.loginName === 'softcafe') {
        return true;
      }
      else{
        return this.router.createUrlTree(['/news-feeds']);
      }
    }else{
      return this.router.createUrlTree(['/signature/agreement']);
    }
  }

}
