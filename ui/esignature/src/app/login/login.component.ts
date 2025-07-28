import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { interval } from 'rxjs';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { routerTransition } from '../router.animations';
import { BranchService } from '../service/branch.service';
import { EncrDecrService } from '../service/encr-decr.service';
import { PermissioinStoreService } from '../service/permissioin-store.service';
import { RegexFormValidationService } from '../service/regex-form-validation.service';
import { app } from '../softcafe/common/App';
import { Softcafe } from '../softcafe/common/Softcafe';
import { CommonService } from '../softcafe/common/common.service';
import { Service } from '../softcafe/common/service';
import { ActionType } from '../softcafe/constants/action-type.enum';
import { ContentType } from '../softcafe/constants/content-type.enum';
import { KeyCode } from '../softcafe/constants/key-code.enum';
import { UserUnlockComponent } from '../user-unlock/user-unlock.component';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})
export class LoginComponent extends Softcafe implements OnInit, Service {
    [x: string]: any;

    @Input()
    private userUnlock = UserUnlockComponent;
    show2FaFrm = false;
    app = app;

    n1: number;
    n2: number;
    imageName: number = 0;
    captureSum: number;


    twoFAFrm: FormGroup;

    logoName = environment.logoName;
    otpCode: string;

    showProgress = false;
    clicked = false;
    link: string;
    clickLoginBtn: boolean = false;
    isUser: boolean = false;
    publicViewUser: any;
    firstLoginUserInfo: any;
    iAgree: boolean = false;
    passwordType: string = 'password';
    timerSubscription: any;
    countdown: number = 0;
    showButton: boolean = false;
    validUser: any;
    otp: boolean = false;
    otpMessage: string = '';
    exotp: boolean = false;

    constructor(
        public router: Router,
        public cs: CommonService,
        private fb: FormBuilder,
        public branchService: BranchService,
        private permissioinStoreService: PermissioinStoreService,
        private encrService: EncrDecrService,
        private regexFormValidationService: RegexFormValidationService,
        private ngModel: NgbModal,
    ) {
        super();
        const value = this.router.getCurrentNavigation()?.extractedUrl?.queryParams;
        // this.router.getCurrentNavigation().extractedUrl?.queryParams;
        debugger
        if (value) {
            // this.isUser = value['isUser'] ?? false;
            this.link = value['link'];
        }

    }

    loginName = new FormControl('', [Validators.required])
    password = new FormControl('', [Validators.required])

    ngOnInit() {
        this.generateCapture();
        console.log(environment);
        this.show2FaFrm = false;
        this.permissioinStoreService.permissionList = []
        // this.permissioinStoreService.loadPermission();
        this.branchService.loadnBranch();

        if (this.cs.isLoggedIn()) {
            this.router.navigate(['/dashboard']);
        }
        else if (this.link) {
            this.checkIsApplicationUser(this.link);
        }

        this.twoFAFrm = this.fb.group({
            verificationCode: new FormControl()
        });
    }

    viewPass() {
        this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
    }

    checkIsApplicationUser(link: any) {
        const payload = {
            publicLink: link,
        }

        this.cs.sendRequestPublic(this, ActionType.CHECK_USER, ContentType.Request, 'CHECK_USER', payload);
    }

    loginForm: FormGroup = this.fb.group({
        loginName: this.loginName,
        password: this.password,
        otp: '',
        capture: ['', [Validators.required]],
    });


    onLoggedin() {
        if (this.showProgress) {
            return;
        }
        const sKey = environment.SECRET_KEY;
        //this.router.navigate(['/dashboard']);
        var payload = JSON.parse(JSON.stringify(this.loginForm.value));
        payload.email = payload.loginName;
        // payload.defaultAdPass = environment.LDAP_PASSWORD;
        payload.password = this.encrService.set(environment.SECRET_KEY, payload.password);
        console.log('encrypt pass is ', payload.password);
        payload.userStringId = this.validUser?.userStringId;
        debugger

        let enp = this.encrService.set(sKey, environment.LDAP_PASSWORD);
        payload.defaultAdPass = enp;
        console.log('encripted value: ', enp);
        payload.otp = this.otpCode;
        // console.log('decrypted value: ', this.encrService.get(sKey, enp));

        this.showProgress = true;
        this.clicked = true;

        this.cs.sendRequestPublic(this, ActionType.LOGIN, ContentType.User, 'login', payload, "/login");
    }


    onSubmitByEnterKey(event) {
        console.log(event);
        if (event.keyCode === KeyCode.KEY_CODE_ENTER) {
            // this.onLoggedin();
            this.onChangePassClick();
        }
    }

    onResend2FaCode(twoFAFrm: FormGroup) {
        var payload = this.loginForm.value;
        payload.email = payload.loginName;
        this.cs.sendRequest(this, ActionType.RESEND_2FA_CODE, ContentType.User, 'onResend2FaCode', payload);
    }

    onVerify2FaLogin(twoFAFrm: FormGroup) {

        var payload = this.loginForm.value;
        payload.email = payload.loginName;
        payload.verificationCode = twoFAFrm.value.verificationCode;
        this.cs.sendRequest(this, ActionType.VERIFY_LOGIN_2_FA, ContentType.User, 'onVerify2FaLogin', payload);
    }
    onOtpInput(event: any) {
        debugger
        const value = event.target.value;
        // Remove any non-numeric characters
        this.otpCode = value.replace(/\D/g, '');
        event.target.value = this.otpCode;
        if (value && value.length < 6) {
            this.otpMessage = 'OTP should be 6 digits';
        }
        else if (value && value.length === 6) {
            this.otpMessage = '';
        }
    }
    ontwoFaFrmBack(twoFAFrm: FormGroup) {
        this.show2FaFrm = false;
        this.twoFAFrm.reset();
        this.loginForm.reset();
    }

    findFirstLoginLink(user: any) {
        const payload = {
            userId: user.userId,
        }

        this.cs.sendRequestPublic(this, ActionType.FIND_LINK, ContentType.User, 'find_link', payload);
    }

    generateCapture() {
        console.log('ok');

        this.n1 = Math.floor(Math.random() * 10);
        this.n2 = Math.floor(Math.random() * 10);
        this.captureSum = this.n1 + this.n2;

        console.log('two numbers are: ', this.n1, this.n2, '\n and sum is: ', this.captureSum);
        this.generatImagName();
    }
    generatImagName() {
        this.imageName = Math.floor(Math.random() * 10);
        console.log('image name: ', this.imageName);
    }
    loadCapture(): string {
        return this.n1 + ' + ' + this.n2 + ' = ?'
    }
    checkCapture(): boolean {
        return this.loginForm.get('capture').hasError('required')
            || (this.loginForm.get('capture').value != this.captureSum
                || this.loginForm.get('capture').value?.length <= 0);
    }

    buildLogingUser(user: any) {

        if (user.regexList?.length > 0) {
            this.regexFormValidationService.regexList(user.regexList)
        }
        if (user.loginName === 'softcafe') {
            localStorage.setItem("AUTH_TOKEN", this.firstLoginUserInfo.token);
            localStorage.setItem("IS_AUTHENTICATED", this.firstLoginUserInfo.authenticated);
            this.cs.storeLoginUser(user);
            this.router.navigate(['/dashboard']);
        } else if (!this.isUser && user?.firstLogin == 1 && user?.userType === "EXTERNAL_USER") {
            this.findFirstLoginLink(user);
        }
        else if (this.isUser && this.link) {
            localStorage.setItem("AUTH_TOKEN", this.firstLoginUserInfo.token);
            localStorage.setItem("IS_AUTHENTICATED", this.firstLoginUserInfo.authenticated);
            this.cs.storeLoginUser(user);
            if (user.userId === this.publicViewUser.userId) {
                this.router.navigate(['/public-view'], { queryParams: { link: this.link } });
            } else {
                console.log(`login user: ${user.loginName} and signature view user: ${this.publicViewUser.loginName} is not match.`);
                Swal.fire({
                    icon: 'error',
                    title: 'Unauthorized',
                    text: 'You are not Authorized for viewing signature.'
                });
            }
        }
        else {
            localStorage.setItem("AUTH_TOKEN", this.firstLoginUserInfo.token);
            localStorage.setItem("IS_AUTHENTICATED", this.firstLoginUserInfo.authenticated);
            this.cs.storeLoginUser(user);
            this.router.navigate(['/signature/agreement']);
        }
    }


    onChangePassClick(isResend: boolean = false) {
        debugger
        if (this.countdown > 0) {
            return;
        }

        this.clickLoginBtn = true;
        if (!isResend && (this.loginForm.invalid || this.checkCapture())) {
            Swal.fire('Please fill up all required field.');
            // Swal.fire('Required Field');
            this.generateCapture();
            return;
        }
        // if (!isResend  && !this.iAgree) {
        //     Swal.fire('Please select Agree.');
        //     return;
        // }
        const sKey = environment.SECRET_KEY;
        //this.router.navigate(['/dashboard']);
        var payload = JSON.parse(JSON.stringify(this.loginForm.value));
        payload.email = payload.loginName;
        // payload.defaultAdPass = environment.LDAP_PASSWORD;
        payload.password = this.encrService.set(environment.SECRET_KEY, payload.password);
        console.log('encrypt pass is ', payload.password);
        debugger

        let enp = this.encrService.set(sKey, environment.LDAP_PASSWORD);
        payload.defaultAdPass = enp;
        console.log('encripted value: ', enp);
        // console.log('decrypted value: ', this.encrService.get(sKey, enp));


        console.info(payload);

        Swal.fire({
            icon: 'info',
            title: 'Info',
            // text: 'Are you want to submit your request?',
            text: 'Want to Submit?',
            confirmButtonText: 'Confirm',
            denyButtonText: 'No',
            showConfirmButton: true,
            showDenyButton: true,
        }).then(r => {
            if (r.isConfirmed) {
                this.showProgress = true;
                this.clicked = true;
                // this.loading = true;
                // this.isSubmit = true;
                this.cs.sendRequestPublic(this, ActionType.LOGIN_OTP, ContentType.User, 'LOGIN_OTP', payload);
            } else {
                return;
            }
        });

    }

    startCountdown() {
        this.timerSubscription = interval(1000).subscribe((seconds) => {
            this.countdown = 180 - seconds;
            if (this.countdown <= 0) {
                this.showButton = true;

                this.timerSubscription.unsubscribe();
            } else {
                this.showButton = false;
            }
        });
    }

    internalUserUnlock() {
        debugger
        const mdl = this.ngModel.open(this.userUnlock, { backdrop: 'static', size: 'lg' });
        mdl.componentInstance.loginName = this.loginForm.get('loginName').value;

        mdl.result.then(res => {
            if (res) {
                Swal.fire(res);
            }

        });
    }


    onResponse(service: Service, req: any, basicRes: any) {
        console.log('success');
        this.permissionList = basicRes?.permission;

        if(this.permissionList){
            this.permissioinStoreService.setPermission(this.permissionList);
        }

        this.showProgress = false;
        this.clicked = false;
        var response = basicRes.res ?? basicRes;
        debugger
        if (!super.isOK(response)) {
            const r = super.getErrorMsg(response);
            let res: any;
            try {
                res = JSON.parse(r);
            } catch (error) {
                Swal.fire(r);
                return;
            }
            if (res?.type === 'ADMIN_BLOCK_USER') {
                Swal.fire(super.getErrorMsg(res?.msg ?? response));
            } else if (res?.userType === 'INTERNAL_USER' && res?.type) {
                Swal.fire({
                    icon: 'info',
                    title: 'Information',
                    text: 'Your user has been Locked. Do you want to Unlock your user?',
                    showCancelButton: true,
                    cancelButtonText: 'No',
                    cancelButtonColor: 'btn-danger',
                    showConfirmButton: true,
                    confirmButtonText: 'Yes',
                    confirmButtonColor: 'btn-primary'
                }).then(r => {
                    if (r.isConfirmed) {
                        this.internalUserUnlock();
                    }
                });

            }
            else if (res?.userType === 'EXTERNAL_USER' && res?.type) {
                Swal.fire({
                    icon: 'info',
                    title: 'Information',
                    text: 'Your user has been Locked. Do you want to Unlock your user?',
                    // text: res?.msg ?? 'Your user has been Locked. Do you want to Unlock your user?',
                    showCancelButton: true,
                    cancelButtonText: 'No',
                    cancelButtonColor: 'btn-danger',
                    showConfirmButton: true,
                    confirmButtonText: 'Yes',
                    confirmButtonColor: 'btn-primary'
                }).then(r => {
                    if (r.isConfirmed) {
                        this.router.navigate(['/user-unlock']);
                    } else {
                        this.router.navigate(['/login']);
                    }
                })
            }
            else {
                Swal.fire(super.getErrorMsg(res?.msg ?? response));
            }
            return;
        }

        if (response.header.referance == 'login') {
            this.clickLoginBtn = false;

            if (response.payload.length > 0) {
                // don't worry about this error in this variable.
                // this is global variable declare in index.html file
                var user = response.payload[0];
                if (user.allowLogin != 1) {
                    //TODO:
                    //alert("Sorry! You are not allow to login.");
                    Swal.fire({ text: "Sorry! You are not allowed to login." })
                    //this.toastService.add({ severity: 'error', summary: 'Error', detail: 'Sorry! You are not allow to login.' });
                    // this.loginForm.get('password').setValue(null);
                    // this.router.navigate(['/login']);
                    return;
                }
                else if (user.twoFactorAuth == 1) {
                    this.show2FaFrm = true;
                }
                else {
                    if (user?.msg) {
                        Swal.fire({
                            icon: 'info',
                            title: 'Information',
                            text: user.msg,
                        }).then(() => {
                            this.firstLoginUserInfo = basicRes;
                            // if (!this.isUser && user.firstLogin === 1 && user.userType === "EXTERNAL_USER") {
                            //     this.findFirstLoginLink(user);
                            // }
                            this.buildLogingUser(user);
                        });
                    } else {
                        this.firstLoginUserInfo = basicRes;
                        // localStorage.setItem("AUTH_TOKEN", basicRes.token);
                        // localStorage.setItem("IS_AUTHENTICATED", basicRes.authenticated);
                        // this.cs.storeLoginUser(response.payload[0]);
                        this.buildLogingUser(user);
                    }

                }
            }
            else {
                Swal.fire({ text: "Invalid username or password" })
                //alert("Invalid username or password");
            }
        }
        else if (response.header.referance === 'CHECK_USER') {
            const user = response.payload;
            if (user) {
                this.isUser = true;
                this.publicViewUser = user;
                this.loginForm.get('loginName').setValue(this.publicViewUser.loginName);
                //   this.router.navigate(['/login'], {queryParams: {isUser: true, link: this.link['link']}});
            } else {
                this.router.navigate(['/public-view'], { queryParams: { link: this.link } })
            }

        }
        else if (response.header.referance == 'find_link') {
            const userLink = response.payload.link;
            if (userLink) {
                this.router.navigate(['/complete-regi'], { queryParams: { 'link': userLink, 'firstLoginUserInfo': this.firstLoginUserInfo } });
            }
        }
        else if (response.header.referance == 'onVerify2FaLogin') {
            var user = response.payload[0];
            this.cs.storeLoginUser(response.payload[0]);
            this.router.navigate(['/dashboard']);
        }

        else if (response.header.referance == 'LOGIN_OTP') {
            this.clickLoginBtn = false;
            Swal.fire({
                timer: 5000,
                title: 'Success',
                // text: 'A OTP send to your mail',
                text: 'An OTP will be sent to your registered e-mail.',
                icon: 'success'
            }).then(() => {
                this.validUser = response.payload;
                // this.cs.storeLoginUser(response.payload[0]);
                this.otp = true;
                this.startCountdown();

            });

        }


    }

    onError(service: Service, req: any, response: any) {
        this.showProgress = false;
        if (!app.loginRequired) {
            var user = { userId: 1, loginName: 'dummy', name: "dummy" };
            this.cs.storeLoginUser(user);
            this.router.navigate(['/dashboard2']);
        }
        Swal.fire(response.message);
        console.log(response);
    }

    interval = setInterval(() => {
        if (true) {
            console.log('ok');
            this.generateCapture();
            console.log('two numbers are: ', this.n1, this.n2, '\n and sum is: ', this.captureSum);
            this.loadCapture();
        }
    }, 3 * 60 * 1000);

}
