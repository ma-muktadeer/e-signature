import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonService } from '../softcafe/common/common.service';

@Injectable({
  providedIn: 'root'
})
export class LayoutGuard implements CanActivate {
  constructor(private cs : CommonService, private router : Router){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    var auth = this.cs.isAuthenticated()
    console.log("checking user ", auth);
    if (auth){
      console.log("login user id : " + auth);
      return true;
    }
    this.router.navigate(["/login"]);
    return false;
  }
}
