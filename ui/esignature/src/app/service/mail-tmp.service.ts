import { Injectable } from '@angular/core';
import { AppRole } from '../softcafe/common/AppRole';
import { CommonService } from '../softcafe/common/common.service';

@Injectable({
  providedIn: 'root'
})
export class MailTmpService {

  mailTmpMakerRoles = [AppRole.SUPER_ADMIN, AppRole.SYSTEM_USER, AppRole.EMAILING_TSD_MAKER] //create , update
  mailTmpCheckerRoles = [AppRole.SUPER_ADMIN,AppRole.SYSTEM_USER, AppRole.EMAILING_TSD_CHECKER]//approve, delete
  mailTmpViewrRoles = [AppRole.SUPER_ADMIN,AppRole.SYSTEM_USER, AppRole.EMAILING_TSD_VIEWER]//only view

  constructor(private cs : CommonService) { }

  save(){
    
  }

  makerRoleCheck(){
    return this.cs.hasAnyRole(this.mailTmpMakerRoles);
  }

  checkerRoleCheck(){
    return this.cs.hasAnyRole(this.mailTmpCheckerRoles);
  }

  viewerRoleCheck(){
    return this.cs.hasAnyRole(this.mailTmpViewrRoles);
  }
}
