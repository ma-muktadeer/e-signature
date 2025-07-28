import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { app } from 'src/app/softcafe/common/App';
import { ProfileImageService } from 'src/app/softcafe/common/profile-image.service';
import { ActionType } from 'src/app/softcafe/constants/action-type.enum';
import { ContentType } from 'src/app/softcafe/constants/content-type.enum';
import Swal from 'sweetalert2';
import { Softcafe } from '../../../softcafe/common/Softcafe';
import { CommonService } from '../../../softcafe/common/common.service';
import { Service } from '../../../softcafe/common/service';
import { UserService } from '../../admin/services/user.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent extends Softcafe implements OnInit, Service, OnDestroy {
    pushRightClass: string = 'push-right';
    isExpanded: boolean = false;
    public profileImage: any = 'assets/images/pro/1.png';
    loginUser: any;
    app = app;
    // rqTimer;
    // rqTimer: NodeJS.Timeout;
    private subscription!: Subscription;

    constructor(
        private translate: TranslateService,
        public router: Router,
        public cs: CommonService,
        private userService: UserService,
        private profileImageService: ProfileImageService,
    ) {
        super();

        this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'fa', 'de', 'zh-CHS']);
        this.translate.setDefaultLang('en');
        const browserLang = this.translate.getBrowserLang();
        this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de|zh-CHS/) ? browserLang : 'en');

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
        this.loginUser = this.cs.loadLoginUser();
        this.loadProfileImg();
        this.subscription = this.profileImageService.methodCall$.subscribe(r => {
            this.loadProfileImg();
        });

        // if (this.loginUser?.profileImage) {
        //     debugger
        //     this.loadProfileImg();
        //     this.subscription = this.profileImageService.methodCall$.subscribe(r => {
        //         this.loadProfileImg();
        //     });
        // } else {
        //     this.profileImage = 'assets/images/pro/1.png';
        // }
    }
    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }

    loadProfileImg() {
        if (localStorage.getItem('profileImage') == null && this.loginUser?.profileImage) {
            debugger
            const payload = {
                profileImage: this.loginUser.profileImage,
            }
            this.cs.sendRequest(this, ActionType.LOAD_IMAGE, ContentType.User, 'LOAD_IMAGE', payload);
        } else {
            this.loadImage();
        }
    }

    loadImage() {
        this.profileImage = localStorage.getItem('profileImage') ?? 'assets/images/pro/1.png';
    }

    isToggled(): boolean {
        const dom: Element = document.querySelector('body');
        return dom.classList.contains(this.pushRightClass);
    }

    toggleSidebar() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle(this.pushRightClass);
    }

    onClickChangepassword(requestType: string) {
        // this.requestType = requestType;
        this.userService.changeCurrentUser(this.cs.loadLoginUser());

        this.router.navigate(['/user/change-password'], { state: { requestType: requestType } });
    }
    rltAndLtr() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle('rtl');
    }

    onLoggedout() {
        Swal.fire({
            title: "Confirmation",
            text: "Are you sure want to logout?",
            icon: 'warning',
            showDenyButton: true,
            confirmButtonText: 'Confirm',
            denyButtonText: 'No',
        }).then((result) => {
            if (result.isConfirmed) {
                this.cs.logout(this);
            }
        });
        // this.cs.logout(this);
    }

    changeLang(language: string) {
        this.translate.use(language);
    }

    onClickHeaderProfile() {
        debugger
        if (this.router.url === '/user/profile2') {
            // Reload the current route
            this.router.navigateByUrl('/news-feeds', { skipLocationChange: true }).then(() => {
                this.reloadProfile(false);
                this.router.navigate(['/user/profile2']).then(() => {
                });
            });
        }
        else {
            this.reloadProfile(false);
            this.router.navigate(['/user/profile2']);
        }
    }

    reloadProfile(addUser: boolean) {
        debugger
        this.userService.changeCurrentUser(this.cs.loadLoginUser());
        // this.userService.addUser = false;
        // this.router.navigate(['/user/profile']);
        this.isAddUser(addUser);
    }
    isAddUser(addUser: boolean) {
        this.userService.addUser = addUser;
        // this.reloadProfile();
    }

    onResponse(service: Service, req: any, response: any) {
        debugger
        if (!super.isOK(response)) {
            console.log(super.getErrorMsg(response));
            return;
        }
        if (response.header.referance == 'logout') {
            console.log('logout success');
            this.router.navigate(["/login"]);
            this.cs.removeSession();
        }
        else if (response.header.referance == 'LOAD_IMAGE') {
            this.profileImage = response.payload.profileImage;
            localStorage.setItem('profileImage', this.profileImage);
        }
    }
    onError(service: Service, req: any, res: any) {
        console.log('error', res);
    }
}
