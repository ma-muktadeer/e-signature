import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonService } from 'src/app/softcafe/common/common.service';

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordGuard implements CanActivate {
  constructor(private cs: CommonService){

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.cs.loadLoginUser()?.userType === 'EXTERNAL_USER';
  }
  
}
