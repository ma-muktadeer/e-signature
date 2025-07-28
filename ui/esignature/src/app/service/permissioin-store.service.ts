import { Injectable } from '@angular/core';
import { AppRole } from '../softcafe/common/AppRole';
import { CommonService } from '../softcafe/common/common.service';

@Injectable({
  providedIn: 'root'
})
export class PermissioinStoreService {

  permissionList = []

  public appPermission = AppPermission


  constructor(private cs: CommonService) {
    debugger
    if (localStorage.getItem('permission')) {
      this.permissionList = JSON.parse(localStorage.getItem('permission'));
      console.log(this.permissionList)
    }
  }

  private getPermission(): any[] {
    return JSON.parse(localStorage.getItem('permission')) ?? [];
  }
  setPermission(permissionList) {
    localStorage.setItem('permission', JSON.stringify(permissionList));
  }
  //new
  loadPermission() {
    if (this.permissionList?.length > 0) {
      return;
    }
    else {
      this.permissionList = JSON.parse(localStorage.getItem('permission')) ?? [];
    }
  }
  //old
  // loadPermission() {
  //   if (this.permissionList.length > 0) {
  //     return;
  //   }
  //   this.cs.executePublic(ActionType.LOAD_PERMISSION, ContentType.AppPermission, {})
  //     .subscribe((res: any) => {
  //       console.log(res);
  //       this.permissionList = res.payload
  //       localStorage.setItem('permission', JSON.stringify(this.permissionList));
  //     });
  // }

  hasPermission(permissioin: AppPermission) {
    // console.log(this.permissionList, permissioin)
    if (!this.permissionList || !this.permissionList?.length) {
      this.permissionList = this.getPermission();
    }
    if (this.cs.forceAllow()) {
      return true;
    }
    var exists = this.permissionList.find(f => f.permissionName == permissioin)
    // var exists = this.permissionList.find(x => x.permissionName == permissioin)

    if (!exists) {
      return false;
    }

    if (!exists?.roleName) {
      return false;
    }
    // if (!exists.roleList) {
    //   return false;
    // }

    // var permissonRoleList = exists.roleList.map(x => x.roleName);
    // debugger
    return this.cs.hasRole(exists?.roleName);
  }

  hasAnyPermission(permissioin: Array<AppPermission>) {

    if (this.cs.forceAllow()) {
      return true;
    }

    var allow = false;

    permissioin.forEach(p => {
      var success = this.hasPermission(p)
      if (success) {
        allow = true;
        return allow;
      }
    })

    return allow;
  }

  isBranchMaker() {
    return this.cs.hasAnyRole([AppRole.APPLICATION_SYSTEM_ADMINISTRATION_MAKER, AppRole.SUPER_ADMIN, AppRole.SYSTEM_USER])
  }


}






export enum AppPermission {
  USER_VIEWER = "VIEW_USER",
  USER_MAKER = "SAVE_USER",
  EXTERNAL_SAVE_USER = "EXTERNAL_SAVE_USER",
  INTERNAL_SAVE_USER = "INTERNAL_SAVE_USER",

  // SAVE_USER="SAVE_USER",
  USER_APPROVER = "USER_APPROVER",
  DELETE_USER = "DELETE_USER",
  PASSWORD_ADMIN = "PASSWORD_ADMIN",//send pass to user mail

  VIEW_BRANCH = "VIEW_BRANCH",
  SAVE_BRANCH = "SAVE_BRANCH",
  DELETE_BRANCH = "DELETE_BRANCH",
  APPROVE_BRANCH = "APPROVE_BRANCH",

  VIEW_ROLE = "VIEW_ROLE",
  MAKE_ROLE = "MAKE_ROLE",
  APPROVE_ROLE = "APPROVE_ROLE",
  DELETE_ROLE = "DELETE_ROLE",
  DISCLAIMER_SETUP = "DISCLAIMER_SETUP",

  APPLICATION_SETUP_MAKER = "APPLICATION_SETUP_MAKER",
  // APPLICATION_SETUP_CHECKER = "APPLICATION_SETUP_CHECKER",
  ACCESS_APPLICATION_SETUP = "ACCESS_APPLICATION_SETUP",
  APPLICATION_CONFIG_SETUP = "APPLICATION_CONFIG_SETUP",
  APPLICATION_CONTACT_SETUP = "APPLICATION_CONTACT_SETUP",


  SAVE_PERMISSION = "SAVE_PERMISSION",
  VIEW_PERMISSION = "VIEW_PERMISSION",


  // SAVE_SIGNATURE="SAVE_SIGNATURE",
  SIGNATURE_MAKER = "SIGNATURE_MAKER",
  UPDATE_SIGNATURE = "UPDATE_SIGNATURE",
  UPLOAD_SIGNATURE = "UPLOAD_SIGNATURE",
  FILE_UPLOAD = "FILE_UPLOAD",
  APPROVE_SIGNATURE = "APPROVE_SIGNATURE",
  SIGNATURE_DELETER = "SIGNATURE_DELETER",
  // DELETE_SIGNATURE = "DELETE_SIGNATURE",
  APPROVE_DELETE_SIGNATURE = "APPROVE_DELETE_SIGNATURE",
  SIGNATURE_VIEWER = "SIGNATURE_VIEWER",
  EXTERNAL_SIGNATURE_VERIFIER = "EXTERNAL_SIGNATURE_VERIFIER",
  INTERNAL_SIGNATURE_VERIFIER = "INTERNAL_SIGNATURE_VERIFIER",
  // VIEW_SIGNATURE="VIEW_SIGNATURE",
  DOWNLOAD_SIGNATURE = "DOWNLOAD_SIGNATURE",
  DOWNLOAD_SINGLE_SIGNATURE = "DOWNLOAD_SINGLE_SIGNATURE",
  SEARCH_SIGNATURE = "SEARCH_SIGNATURE",
  REQUEST_MAKER = "REQUEST_MAKER",
  REQUEST_VIEWER = "REQUEST_VIEWER",
  REQUEST_CHECKER = "REQUEST_CHECKER",
  REQUEST_APPROVER = "REQUEST_APPROVER",
  SIGNATORY_MAKER = "SIGNATORY_MAKER",
  SIGNATORY_VIEWER = "SIGNATORY_VIEWER",
  SIGNATORY_CHECKER = "SIGNATORY_CHECKER",
  // SIGNATORY_APPROVER = "SIGNATORY_APPROVER",
  INSTITUTION_VIEWER = "INSTITUTION_VIEWER",
  INSTITUTION_MAKER = "INSTITUTION_MAKER",
  INSTITUTION_CHECKER = "INSTITUTION_CHECKER",
  // INSTITUTION_APPROVER = "INSTITUTION_APPROVER",
  INSTITUTION_DELETER = "INSTITUTION_DELETER",
  INSTITUTION_DELETE_APPROVER = "INSTITUTION_DELETE_APPROVER",

  MAIL_TEMPLATE_VIEWER = "MAIL_TEMPLATE_VIEWER",
  MAIL_TEMPLATE_MAKER = "MAIL_TEMPLATE_MAKER",
  MAIL_TEMPLATE_DELETER = "MAIL_TEMPLATE_DELETER",
  MAIL_TEMPLATE_CHECKER = "MAIL_TEMPLATE_CHECKER",
  MAIL_TEMPLATE_APPROVER = "MAIL_TEMPLATE_APPROVER",

  COPY_TEXT = "COPY_TEXT",
  SIGNATORY_DELETER = "SIGNATORY_DELETER",
  AGREEMENT_SETUP_VIEWER = "AGREEMENT_SETUP_VIEWER",
  AGREEMENT_SETUP_MAKER = "AGREEMENT_SETUP_MAKER",
  SIGNATURE_SETUP_VIEWER = "SIGNATURE_SETUP_VIEWER",
  ACTIVITY_LOG_VIEWER = "ACTIVITY_LOG_VIEWER",
  LEGAL_DISCLAIMER_VIEWER = "LEGAL_DISCLAIMER_VIEWER",
  LEGAL_DISCLAIMER_MAKER = "LEGAL_DISCLAIMER_MAKER",
  USER_MANAGMENT = "USER_MANAGMENT",
  SIGNATURE_LOG_VIEWER = "SIGNATURE_LOG_VIEWER",
  GENERATE_LINK = "GENERATE_LINK",

  USER_REPORT_VIEWER = "USER_REPORT_VIEWER",
  LOGGED_REPORT_VIEWER = "LOGGED_REPORT_VIEWER",
  PASSWORD_REPORT_VIEWER = "PASSWORD_REPORT_VIEWER",
  SIGNATURE_REPORT_VIEWER = "SIGNATURE_REPORT_VIEWER",
  SIGNATURE_SEARCH_VIEWER = "SIGNATURE_SEARCH_VIEWER",
  NEWS_FEED_REPORT_VIEWER = "NEWS_FEED_REPORT_VIEWER",
  PRINT_DOWNLOAD_REPORT_VIEWER = "PRINT_DOWNLOAD_REPORT_VIEWER",
  USER_AUDIT_REPORT_VIEWER = "USER_AUDIT_REPORT_VIEWER",
  HR_MODULE_REPORT_VIEWER = "HR_MODULE_REPORT_VIEWER",
  SIGNATURE_HISTORY_VIEWER = "SIGNATURE_HISTORY_VIEWER",
  REQUEST_ADMIN = "REQUEST_ADMIN",
  VIEW_DASHBOARD = "VIEW_DASHBOARD",
  SAMPLE_DOCUMENT_SAVER = "SAMPLE_DOCUMENT_SAVER",
  SAMPLE_DOCUMENT_APPROVER = "SAMPLE_DOCUMENT_APPROVER",
  SAMPLE_DOCUMENT_DOWNLOADER = "SAMPLE_DOCUMENT_DOWNLOADER",

  VIEW_SECURITY_QUESTION = "VIEW_SECURITY_QUESTION",
  ADD_SECURITY_QUESTION = "ADD_SECURITY_QUESTION",
  VIEW_SECURITY_QUESTION_ANS = "VIEW_SECURITY_QUESTION_ANS",
  ADD_SECURITY_QUESTION_ANS = "ADD_SECURITY_QUESTION_ANS",
  HR_SIGNATURE_CHECKER = "HR_SIGNATURE_CHECKER",
  USERS_UNDER_ROLE_VIEWER = "USERS_UNDER_ROLE_VIEWER",
  OTHERS_SIGNATURE_UPLOADER = "OTHERS_SIGNATURE_UPLOADER",
  PA_REPORT_VIEWER = "PA_REPORT_VIEWER",
  BANK_REPORT_VIEWER = "BANK_REPORT_VIEWER",
  HR_ROLE = "HR_ROLE",
  DOC_REPORT_VIEWER = "DOC_REPORT_VIEWER",
  SIGNATURE_HIS_REPORT_VIEWER = "SIGNATURE_HIS_REPORT_VIEWER",
  EXCEPTION_REPORT_VIEWER = "EXCEPTION_REPORT_VIEWER",
  REQUEST_REPORT_VIEWER = "REQUEST_REPORT_VIEWER",
}