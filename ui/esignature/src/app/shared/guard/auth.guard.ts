import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import { CommonService } from '../../softcafe/common/common.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private cs : CommonService) {}

    canActivate() {
        
        var loginUser = this.cs.loadLoginUser();

        if (loginUser) {
            return true;
        }

        this.router.navigate(['/login']);
        return false;
    }
}
