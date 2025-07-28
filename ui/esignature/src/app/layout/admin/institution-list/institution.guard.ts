import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AppPermission, PermissioinStoreService } from 'src/app/service/permissioin-store.service';

@Injectable({
  providedIn: 'root'
})
export class InstitutionGuard implements CanActivate {
  private appPermission = AppPermission;
  constructor(private router: Router, private permissionStoreService: PermissioinStoreService) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    debugger
    return this.permissionStoreService.hasPermission(this.appPermission.INSTITUTION_VIEWER) ? true : this.router.parseUrl('/not-found')
    // return this.permissionStoreService.hasPermission(this.appPermission.INSTITUTION_VIEWER);
  }

}
