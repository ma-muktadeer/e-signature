import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import { CommonService } from '../../softcafe/common/common.service';

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(private router: Router, private cs : CommonService) {}
    canActivate() {
        /* if(this.cs.hasRole(AppRole.ADMIN)){
            return true;
        } */
        return true;
    }
}
