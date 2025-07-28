import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReloadGuardGuard implements CanActivate {
  constructor(private router: Router) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    debugger
    if (state.url === this.router.url) {
      this.router.navigateByUrl('/user/profile', { skipLocationChange: true }).then(() => {
        this.router.navigate([state.url]);
      });
      return false;
    }
    return true;
  }

}
