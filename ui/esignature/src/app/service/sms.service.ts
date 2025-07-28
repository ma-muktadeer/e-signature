import { Injectable } from '@angular/core';
import { AppRole } from '../softcafe/common/AppRole';
import { CommonService } from '../softcafe/common/common.service';
import { SconfigService } from './sconfig.service';

@Injectable({
  providedIn: 'root'
})
export class SmsService {

  smsMakerRoles = [AppRole.SUPER_ADMIN, AppRole.SYSTEM_USER, AppRole.EMAILING_CMO_MAKER]
  smsCheckerRoles = [AppRole.SUPER_ADMIN, AppRole.SYSTEM_USER, AppRole.EMAILING_CMO_CHECKER]
  smsViewrRoles = [AppRole.SUPER_ADMIN, AppRole.SYSTEM_USER, AppRole.EMAILING_CMO_VIEWER]
  
  constructor(private cs : CommonService) { }

  save(value1, value2, value3, value4){
    
  }

  
  makerRoleCheck(){
    return this.cs.hasAnyRole(this.smsMakerRoles);
  }

  checkerRoleCheck(){
    return this.cs.hasAnyRole(this.smsCheckerRoles);
  }

  viewerRoleCheck(){
    return this.cs.hasAnyRole(this.smsViewrRoles);
  }
}
