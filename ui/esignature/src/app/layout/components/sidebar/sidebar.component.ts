import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CustomerService } from 'src/app/service/customer.service';
import { MailTmpService } from 'src/app/service/mail-tmp.service';
import { AppPermission, PermissioinStoreService } from 'src/app/service/permissioin-store.service';
import { SmsService } from 'src/app/service/sms.service';
import { Client } from 'src/app/softcafe/Client';
import { AppRole } from 'src/app/softcafe/common/AppRole';
import { environment } from 'src/environments/environment';
import { Softcafe } from '../../../softcafe/common/Softcafe';
import { CommonService } from '../../../softcafe/common/common.service';
import { Service } from '../../../softcafe/common/service';
import { UserService } from '../../admin/services/user.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    animations: [
        trigger('submenuAnimation', [
          state('collapsed', style({
            height: '0',
            opacity: 0,
            overflow: 'hidden',
          })),
          state('expanded', style({
            height: '*',  // Use the content height
            opacity: 1,
          })),
          transition('collapsed <=> expanded', [
            animate('0.5s ease')
          ]),
        ])
      ]
})
export class SidebarComponent extends Softcafe implements OnInit, Service {

    isExpanded: boolean = false;
    isActive: boolean = false;
    showMenu: string = '';
    pushRightClass: string = 'push-right';

    client = environment.client

    showAdminPanel = false;

    appPermission = AppPermission;
    signatureManagement: AppPermission[] = [
        AppPermission.SIGNATURE_MAKER,
        AppPermission.EXTERNAL_SIGNATURE_VERIFIER,
        AppPermission.INTERNAL_SIGNATURE_VERIFIER,
        AppPermission.SIGNATURE_LOG_VIEWER,
        AppPermission.SIGNATURE_VIEWER,
        AppPermission.SIGNATURE_HISTORY_VIEWER,
        AppPermission.SIGNATORY_VIEWER,
        AppPermission.SAMPLE_DOCUMENT_SAVER,
        AppPermission.SAMPLE_DOCUMENT_DOWNLOADER
    ];


    allowAdminMenuRoles = [AppRole.SUPER_ADMIN, AppRole.SYSTEM_USER, AppRole.USER_ADMINISTRATION_MAKER, AppRole.USER_ADMINISTRATION_CHECKER, AppRole.USER_ADMINISTRATION_VIEWER];
    branchAdminMakerRoles = [AppRole.SUPER_ADMIN, AppRole.SYSTEM_USER, AppRole.APPLICATION_SYSTEM_ADMINISTRATION_MAKER,]
    branchAdminChekerRoles = [AppRole.SUPER_ADMIN, AppRole.SYSTEM_USER, AppRole.APPLICATION_SYSTEM_ADMINISTRATION_CHECKER,]
    branchAdminViewerRoles = [AppRole.SUPER_ADMIN, AppRole.SYSTEM_USER, AppRole.APPLICATION_SYSTEM_ADMINISTRATION_VIEWER]
    userAdminMakerRoles = [AppRole.SUPER_ADMIN, AppRole.SYSTEM_USER, AppRole.USER_ADMINISTRATION_MAKER];
    userAdminChekerRoles = [AppRole.SUPER_ADMIN, AppRole.SYSTEM_USER, AppRole.USER_ADMINISTRATION_CHECKER];
    userAdminViewerRoles = [AppRole.SUPER_ADMIN, AppRole.SYSTEM_USER, AppRole.USER_ADMINISTRATION_VIEWER];
    appSetupMakerRoles = [AppRole.SUPER_ADMIN, AppRole.SYSTEM_USER, AppRole.APPLICATION_SYSTEM_ADMINISTRATION_MAKER];
    appSetupCheckerRoles = [AppRole.SUPER_ADMIN, AppRole.SYSTEM_USER, AppRole.APPLICATION_SYSTEM_ADMINISTRATION_CHECKER];
    appSetupViewerRoles = [AppRole.SUPER_ADMIN, AppRole.SYSTEM_USER, AppRole.APPLICATION_SYSTEM_ADMINISTRATION_VIEWER];
    mailGroupMakerRoles = [AppRole.SUPER_ADMIN, AppRole.SYSTEM_USER, AppRole.EMAILING_TSD_MAKER, AppRole.EMAILING_CMO_MAKER];
    mailGroupCheckerRoles = [AppRole.SUPER_ADMIN, AppRole.SYSTEM_USER, AppRole.EMAILING_TSD_CHECKER, AppRole.EMAILING_CMO_CHECKER];
    mailGroupViewerRoles = [AppRole.SUPER_ADMIN, AppRole.SYSTEM_USER, AppRole.EMAILING_TSD_VIEWER, AppRole.EMAILING_CMO_VIEWER];
    contactGroupMakerRoles = [AppRole.SUPER_ADMIN, AppRole.SYSTEM_USER, AppRole.APPLICATION_SYSTEM_ADMINISTRATION_CHECKER, AppRole.CUSTOMER_SETUP_MAKER];
    contactGroupCheckerRoles = [AppRole.SUPER_ADMIN, AppRole.SYSTEM_USER, AppRole.EMAILING_TSD_CHECKER, AppRole.EMAILING_CMO_CHECKER];
    contactGroupViewerRoles = [AppRole.SUPER_ADMIN, AppRole.SYSTEM_USER, AppRole.EMAILING_TSD_VIEWER, AppRole.EMAILING_CMO_VIEWER];

    allowSettingMenuRoles = [AppRole.SUPER_ADMIN, AppRole.SYSTEM_USER,
    AppRole.CUSTOMER_SETUP_MAKER, AppRole.CUSTOMER_SETUP_CHECKER, AppRole.CUSTOMER_SETUP_VIEWER,
    AppRole.EMAILING_CMO_MAKER, AppRole.EMAILING_CMO_CHECKER, AppRole.EMAILING_CMO_VIEWER,
    AppRole.EMAILING_TSD_MAKER, AppRole.EMAILING_TSD_CHECKER, AppRole.EMAILING_TSD_VIEWER,
    AppRole.APPLICATION_SYSTEM_ADMINISTRATION_MAKER, AppRole.APPLICATION_SYSTEM_ADMINISTRATION_CHECKER,
    AppRole.APPLICATION_SYSTEM_ADMINISTRATION_VIEWER];

    signatureModulePermission = [this.appPermission.SIGNATURE_MAKER, this.appPermission.SIGNATURE_VIEWER, this.appPermission.SIGNATURE_DELETER];

    loginUser: any;
    isRequestUser: any;

    constructor(private translate: TranslateService, public router: Router,
        public cs: CommonService, private userService: UserService,
        public customerService: CustomerService,
        public mailTmpService: MailTmpService,
        public smsTmpService: SmsService,
        public permissioinStoreService: PermissioinStoreService) {
        super();
        this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'fa', 'de']);
        this.translate.setDefaultLang('en');
        const browserLang = this.translate.getBrowserLang();
        this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de/) ? browserLang : 'en');

        this.router.events.subscribe(val => {
            if (
                val instanceof NavigationEnd &&
                window.innerWidth <= 992 &&
                this.isToggled()
            ) {
                this.toggleSidebar();
            }
        });
    }

    ngOnInit() {
        debugger
        this.loginUser = this.cs.loadLoginUser();
        console.log('user ', this.loginUser)
        if (this.client == Client.DHAKA_BANK && this.hasRole(['ADMIN', 'SUPER_ADMIN'])) {
            this.showAdminPanel = true
        }
        else if (this.client == Client.PRIME_BANK && this.hasRole(this.allowAdminMenuRoles)) {
            this.showAdminPanel = true
        }
    }


    checkMasterUser(): any {
        return this.loginUser?.isMasterUser == 1 ? true : false;
    }
    checkSignaturePermission(): any {
        return this.permissioinStoreService.hasAnyPermission(this.signatureModulePermission);
    }

    eventCalled() {
        this.isActive = !this.isActive;
    }


    allowSettingMenu() {
        if (this.cs.forceAllow()) {
            return true;
        }

        return this.hasRole(this.allowSettingMenuRoles);
    }


    onClickChangepassword(requestType: string) {
        // this.requestType = requestType;
        this.userService.changeCurrentUser(this.cs.loadLoginUser());

        this.router.navigate(['/user/change-password'], { state: { requestType: requestType } });
    }

    showAdminMenu() {

        return this.permissioinStoreService.hasAnyPermission(
            [
                this.appPermission.USER_VIEWER,
                this.appPermission.VIEW_BRANCH,
                this.appPermission.VIEW_PERMISSION,
                this.appPermission.VIEW_ROLE,
                this.appPermission.INSTITUTION_VIEWER,
                // this.appPermission.INSTITUTION_VIEWER,
                this.appPermission.VIEW_SECURITY_QUESTION,
                this.appPermission.VIEW_SECURITY_QUESTION_ANS,
            ]);

    }

    // showDashboardMenu() {
    //     return this.permissioinStoreService.hasAnyPermission(
    //         [
    //             this.appPermission.VIEW_EXPORT_LC,
    //             this.appPermission.VIEW_INWARD_MT_103,
    //             this.appPermission.VIEW_EXPORT_BILL,
    //             this.appPermission.VIEW_OUTWARD_LC,
    //             this.appPermission.VIEW_OUTWARD_MT202,
    //             this.appPermission.VIEW_OUTWARD_MT103,
    //             this.appPermission.VIEW_OUTWARD_MT734,
    //             this.appPermission.VIEW_OUTWARD_MT999,
    //             this.appPermission.VIEW_OUTWARD_MT799,
    //             this.appPermission.VIEW_OUTWARD_MT720_1,
    //             this.appPermission.VIEW_EMAIL_REPORT,
    //             this.appPermission.CHECKER_EXPORT_LC,
    //             this.appPermission.CHECKER_INWARD_MT_103,
    //             this.appPermission.CHECKER_EXPORT_BILL,
    //             this.appPermission.CHECKER_OUTWARD_LC,
    //             this.appPermission.CHECKER_OUTWARD_MT202,
    //             this.appPermission.CHECKER_OUTWARD_MT103,
    //             this.appPermission.CHECKER_OUTWARD_MT734,
    //             this.appPermission.CHECKER_OUTWARD_MT999,
    //             this.appPermission.CHECKER_OUTWARD_MT799,
    //             this.appPermission.CHECKER_OUTWARD_MT720_1,
    //             this.appPermission.MAKER_EXPORT_LC,
    //             this.appPermission.MAKER_INWARD_MT_103,
    //             this.appPermission.MAKER_EXPORT_BILL,
    //             this.appPermission.MAKER_OUTWARD_LC,
    //             this.appPermission.MAKER_OUTWARD_MT202,
    //             this.appPermission.MAKER_OUTWARD_MT103,
    //             this.appPermission.MAKER_OUTWARD_MT734,
    //             this.appPermission.MAKER_OUTWARD_MT999,
    //             this.appPermission.MAKER_OUTWARD_MT799,
    //             this.appPermission.MAKER_OUTWARD_MT720_1,
    //             this.appPermission.VIEW_CUSTOMER,
    //             this.appPermission.VIEW_EMAIL_GROUP,
    //             this.appPermission.VIEW_CONTACT_GROUP,
    //             this.appPermission.APPROVE_CUSTOMER,
    //             this.appPermission.DELETE_CUSTOMER,
    //             this.appPermission.VIEW_CONTACT_GROUP,
    //         ])
    // }

    // showReportMenu() {
    //     return this.permissioinStoreService.hasAnyPermission(
    //         [
    //             this.appPermission.VIEW_SMS_REPORT,
    //             this.appPermission.VIEW_EMAIL_REPORT,
    //         ]
    //     )
    // }

    // showInwardExceptionsMenu() {
    //     return this.permissioinStoreService.hasAnyPermission(
    //         [
    //             this.appPermission.VIEW_EXPORT_LC,
    //             this.appPermission.VIEW_INWARD_MT_103,
    //             this.appPermission.VIEW_EXPORT_BILL
    //         ]
    //     )
    // }


    // showOutwardExceptionsMenu() {
    //     return this.permissioinStoreService.hasAnyPermission(
    //         [
    //             this.appPermission.VIEW_OUTWARD_LC,
    //             this.appPermission.VIEW_OUTWARD_MT202,
    //             this.appPermission.VIEW_OUTWARD_MT103,
    //             this.appPermission.VIEW_OUTWARD_MT734,
    //             this.appPermission.VIEW_OUTWARD_MT999,
    //             this.appPermission.VIEW_OUTWARD_MT799,
    //             this.appPermission.VIEW_OUTWARD_MT720_1,
    //         ]
    //     )
    // }

    // showFundRequisitionMenu() {
    //     return this.permissioinStoreService.hasAnyPermission(
    //         [
    //             this.appPermission.FUND_REQUISITION_VIEWER,
    //             this.appPermission.FUND_SETTING_VIEWER,
    //         ]
    //     )
    // }

    showSettingMenu() {
        return this.permissioinStoreService.hasAnyPermission(
            [
                this.appPermission.MAIL_TEMPLATE_VIEWER,
                this.appPermission.AGREEMENT_SETUP_VIEWER,
                this.appPermission.SIGNATURE_SETUP_VIEWER,
                this.appPermission.MAIL_TEMPLATE_VIEWER,
                this.appPermission.ACCESS_APPLICATION_SETUP,
                this.appPermission.DISCLAIMER_SETUP,
                this.appPermission.APPLICATION_CONFIG_SETUP,
            ]
        )
    }

    allowCustomerMenu() {
        if (this.cs.forceAllow()) {
            return true;
        }

        return this.customerService.makerRoleCheck() || this.customerService.checkerRoleCheck() || this.customerService.viewerRoleCheck()
    }

    allowMailTemplateMenu() {
        if (this.cs.forceAllow()) {
            return true;
        }

        return this.mailTmpService.makerRoleCheck() || this.mailTmpService.checkerRoleCheck() || this.mailTmpService.viewerRoleCheck()
    }

    allowSMSTemplateMenu() {
        if (this.cs.forceAllow()) {
            return true;
        }
        return this.smsTmpService.makerRoleCheck() || this.smsTmpService.checkerRoleCheck() || this.smsTmpService.viewerRoleCheck()
    }

    allowEmailGroupMenu() {
        if (this.cs.forceAllow()) {
            return true;
        }
        return this.hasRole(this.mailGroupMakerRoles) || this.hasRole(this.mailGroupCheckerRoles) || this.hasRole(this.mailGroupViewerRoles)
    }

    allowContactGroupMenu() {
        if (this.cs.forceAllow()) {
            return true;
        }
        return this.hasRole(this.contactGroupMakerRoles) || this.hasRole(this.contactGroupCheckerRoles) || this.hasRole(this.contactGroupViewerRoles)

    }

    allowApplicationSetupMenu() {
        if (this.cs.forceAllow()) {
            return true;
        }
        return this.hasRole(this.appSetupMakerRoles) || this.hasRole(this.appSetupCheckerRoles) || this.hasRole(this.appSetupViewerRoles)
    }

    addExpandClass(element: any) {
        debugger
        if (element === this.showMenu) {
            this.isExpanded = false;
            this.showMenu = '0';
        } else {
            this.isExpanded = true;
            this.showMenu = element;
        }
    }

    hasRole(role) {
        return this.cs.hasAnyRole(role);
    }

    isToggled(): boolean {
        const dom: Element = document.querySelector('body');
        return dom.classList.contains(this.pushRightClass);
    }

    toggleSidebar() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle(this.pushRightClass);
    }

    rltAndLtr() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle('rtl');
    }

    changeLang(language: string) {
        this.translate.use(language);
    }

    onLoggedout() {
        this.cs.logout(this);
    }

    onClickSidebarProfile(addUser: boolean, isGoProfile: boolean) {

        if (this.router.url === '/user/profile') {
            // Reload the current route
            this.router.navigateByUrl('/news-feeds', { skipLocationChange: true }).then(() => {
                this.reloadProfile(addUser, isGoProfile);
                this.router.navigate(['/user/profile']);
            });
        } else {
            this.reloadProfile(addUser, isGoProfile);
            this.router.navigate(['/user/profile']);
        }
    }

    reloadProfile(addUser: boolean, isGoProfile: boolean) {
        debugger
        // Check if the current route is '/user/profile'
        if (isGoProfile) {
            this.userService.changeCurrentUser(this.cs.loadLoginUser());
        }
        this.isAddUser(addUser);

    }
    isAddUser(addUser: boolean) {
        this.userService.addUser = addUser;
        // this.reloadProfile();
    }

    checkParmitionV2(permissionList: AppPermission[]): boolean {
        return this.permissioinStoreService.hasAnyPermission(permissionList);
    }

    onResponse(service: Service, req: any, response: any) {
        if (response.header.referance == 'logout') {
            console.log('logout success');
            this.cs.removeSession();
            this.router.navigate(["/login"]);
        }
    }
    onError(service: Service, req: any, response: any) {
        console.log('error');
    }
}
