
import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DevToolsService } from './service/dev-tools.service';
import { PermissioinStoreService } from './service/permissioin-store.service';
import { SconfigService } from './service/sconfig.service';
import { CommonService } from './softcafe/common/common.service';
import { Service } from './softcafe/common/service';
import { DisableRightClickServiceService } from './softcafe/disable-right-click-service.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  APPLICATION_SUTUP = "APPLICATION_SUTUP"
  LOGIN = "LOGIN"

  ENABLE_LOGIN_ATTEMPT = "ENABLE_LOGIN_ATTEMPT"
  BLOCK_LOGIN_ATTEMPT = "BLOCK_LOGIN_ATTEMPT"
  SESSION_TIME_OUT = "SESSION_TIME_OUT"
  app: any;
  configsessionTimeout
  userActivity;
  userInactive: Subject<any> = new Subject(); // Al-Amin
  appTimeoutMin = 5;
  constructor(
    public cs: CommonService,
    public sConfigService: SconfigService,
    public router: Router,
    private permissioinStoreService: PermissioinStoreService,
    private devToolsService: DevToolsService,
    private disableRigthClick: DisableRightClickServiceService) {
    // this.router.routeReuseStrategy.shouldReuseRoute = function() { return false; };
    this.app = cs.app;
  }


  ngOnInit() {
    if(environment.isBlockInspact){
      this.devToolsService.checkDev();
      // this.devToolsService.detectDevTools((isOpen: boolean) => {
      //   // Update the UI or take action based on the DevTools status
      //  debugger
      //   if (isOpen) {
      //     console.log('DevTools are open, take caution.');
      //   } else {
      //     console.log('DevTools are closed.');
      //   }
      // });
    }
    console.log("Init App Component");
    this.permissioinStoreService.loadPermission();

    this.loadsConfigTimeout();
   

    // this.userInactive.subscribe(() => {
    //   this.cs.logout(this);
    // });
    //disabled right click
    this.disableRigthClick.disableRightClick();
    //disable copy text


  }



  loadsConfigTimeout() {
    debugger
    console.log("Getting session timeout");
    this.sConfigService.selectByGroupAndSubGroupConfigNamePublic(this.APPLICATION_SUTUP, this.LOGIN, [this.SESSION_TIME_OUT])
      .subscribe(
        {
          next: (res: any) => {
            console.log(res);
            this.configsessionTimeout = res?.payload
            if (this.configsessionTimeout) {
              this.appTimeoutMin = parseInt(this.configsessionTimeout[0].value1)
            }
            else {
              this.appTimeoutMin = 5
            }

            this.resetTimeout()
            console.log("Setting session timeout", this.appTimeoutMin);
          },
          error: (err: any) => {
            console.log('error', err);
          }
        }
      );
  }

  @HostListener('window:mousemove')
  public refreshUserState() {
    if (environment.production && this.cs.loadLoginUser()?.userId) {
      this.resetTimeout();
    }
  }
  @HostListener('document:selectstart', ['$event'])
  onSelectStart(event: Event) {
    this.disableRigthClick.disableCopy(event);
  }

  resetTimeout() {
    if (this.userActivity) {
      clearTimeout(this.userActivity);
    }
    const time = this.appTimeoutMin * 60 * 1000;

    console.log("Resetting timer", this.appTimeoutMin);

    // if(environment.production){
    this.userActivity = setTimeout(() => {
      this.userInactive.next(undefined);
      console.log("log out session");
      //this.router.navigate(["/login"]);
      this.cs.logout(this);
    }, time);
    // }
  }

  onResponse(service: Service, req: any, res: any) {
    console.log(res)
    if (res.header.referance == 'logout') {
      console.log('logout success');
      this.cs.removeSession();
      this.router.navigate(["/login"]);

    }
    // this.router.navigate(["/login"]);
  }
  onError(service: Service, req: any, res: any) {
    console.log(res)
  }
}
