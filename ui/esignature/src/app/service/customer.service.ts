  import { Injectable } from '@angular/core';
import { AppRole } from '../softcafe/common/AppRole';
import { CommonService } from '../softcafe/common/common.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {


  customerMakerRoles = [AppRole.SUPER_ADMIN,AppRole.SYSTEM_USER,  AppRole.CUSTOMER_SETUP_MAKER]
  customerCheckerRoles = [AppRole.SUPER_ADMIN, AppRole.SYSTEM_USER, AppRole.CUSTOMER_SETUP_CHECKER]
  customerViewrRoles = [AppRole.SUPER_ADMIN, AppRole.SYSTEM_USER, AppRole.CUSTOMER_SETUP_VIEWER]

  constructor(private cs : CommonService) { }

  save(){   
  }

  makerRoleCheck(){
    if(this.cs.forceAllow()){
      return true;
    }
    return this.cs.hasAnyRole(this.customerMakerRoles);
  }

  checkerRoleCheck(){
    if(this.cs.forceAllow()){
      return true;
    }
    return this.cs.hasAnyRole(this.customerCheckerRoles);
  }

  viewerRoleCheck(){
    if(this.cs.forceAllow()){
      return true;
    }
    return this.cs.hasAnyRole(this.customerViewrRoles);
  }
}
