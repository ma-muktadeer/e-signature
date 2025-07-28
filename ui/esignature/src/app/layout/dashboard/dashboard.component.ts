import { Platform } from '@angular/cdk/platform';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { blockToCamel } from 'src/app/service/BlockToCamel';
import { BranchService } from 'src/app/service/branch.service';
import { FileDownloaderService } from 'src/app/service/file-downloader.service';
import { AppPermission, PermissioinStoreService } from 'src/app/service/permissioin-store.service';
import { Softcafe } from 'src/app/softcafe/common/Softcafe';
import { CommonService } from 'src/app/softcafe/common/common.service';
import { Service } from 'src/app/softcafe/common/service';
import { ActionType } from 'src/app/softcafe/constants/action-type.enum';
import { ContentType } from 'src/app/softcafe/constants/content-type.enum';
import { AppGridService } from 'src/app/softcafe/service/app-grid.service';
import { routerTransition } from '../../router.animations';
import { UserService } from '../admin/services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [routerTransition()]
})
export class DashboardComponent extends Softcafe implements OnInit, Service, OnDestroy {
  public alerts: Array<any> = [];
  public sliders: Array<any> = [];
  appPermission = AppPermission
  totalInOutList = [];
  stateList = [];
  branchList = [];

  totalIn = 0;
  totalOut = 0;
  totalMsg = 0;
  showSearchProgress = false;
  public testvalue: number;
  rqTimer;
  dahsbordDetails: any[];

  progress: number;

  loading: boolean = true;
  public primaryColour = '#dd0031';
  public secondaryColour = '#1976d2';
  public coloursEnabled = false;

  constructor(private router: Router,
    private cs: CommonService,
    private userService: UserService,
    public fb: FormBuilder,
    public appGridService: AppGridService,
    public httpClient: HttpClient,
    public branchService: BranchService,
    public platform: Platform,
    public permissioinStoreService: PermissioinStoreService,
    public fileDown: FileDownloaderService,
  ) {
    super();
  }

  ngOnDestroy() {
    if (this.rqTimer) {
      clearInterval(this.rqTimer);
    }
  }

  timeInterval = 1 * 60000000;

  ngOnInit() {
    this.loadDashboard();
  }

  statusChange(status: string): string{
    return blockToCamel(status);
  }

  dashbordLoading = false;
  downloadVideo() {
    this.progress = 0;
    let fileName = 'esig.jar';

    let contentLength: number | null = null;

    this.fileDown.downloadSignature('download/signature').subscribe(event => {

      if (event.type === HttpEventType.ResponseHeader) {
        const contentDisposition = event.headers.get('content-disposition');
        if (contentDisposition) {
          const matches = contentDisposition.match(/filename="([^"]+)"/);
          if (matches && matches.length > 1) {
            fileName = matches[1];
          }
        }
      } else if (event.type === HttpEventType.DownloadProgress) {
        this.progress = Math.round((event.loaded * 100) / event.total);
      } else if (event.type === HttpEventType.Response) {
        const blob = new Blob([event.body], { type: event.headers.get('content-type') });
        saveAs(blob, fileName);
      }


      // if (event.type === HttpEventType.ResponseHeader) {
      //   const contentLengthHeader = event.headers.get('content-length');
      //   if (contentLengthHeader) {
      //     contentLength = parseInt(contentLengthHeader, 10);
      //   }
      //   // You can also extract the file name here if needed
      //   fileName = this.getFileName(event?.headers);
      // } else if (event.type === HttpEventType.DownloadProgress && contentLength !== null) {
      //   this.progress = Math.round((event.loaded * 100) / contentLength);
      // } else if (event.type === HttpEventType.Response) {
      //   // Download complete, save the file here
      //   fileName = this.getFileName(event?.headers);
      //   const blob = new Blob([event.body], { type: event.headers.get('content-type') });
      //   saveAs(blob, fileName);
      // }
    });
  }
  getFileName(header: any): string {
    const contentDisposition = header.get('content-disposition');
    if (contentDisposition) {
      const fileNameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = fileNameRegex.exec(contentDisposition);
      return matches && matches.length > 1 ? matches[1].replace(/['"]/g, '') : 'file';
    }
    return 'esignature';
  }
  // downloadVideo() {
  //   this.fileDown.downloadSignature('download/signature').subscribe(event => {
  //     debugger
  //     if(event != -1){
  //       this.progress = event;
  //     }else{
  //       this.progress = 100;

  //     }
  //   });
  // }
  onRefreshClick() {
    this.dashbordLoading = true;
    this.loadDashboard();
  }

  loadDashboard() {
    var payload = {
      branchId: this.cs.loadLoginUser().branchId
    }
    this.cs.sendRequest(this, ActionType.PBL_DASHBOARD, ContentType.Signature, 'dashboard_list', payload);
    this.rqTimer = setInterval(() => {
      console.log("Getting dashboard data...");
      this.cs.sendRequest(this, ActionType.PBL_DASHBOARD, ContentType.Signature, 'dashboard_list', payload);
    }, this.timeInterval);
  }

  showDashboardMenuUser() {
    return this.permissioinStoreService.hasAnyPermission(
      [
        // this.appPermission.VIEW_EXPORT_LC,
        // this.appPermission.VIEW_INWARD_MT_103,
        // this.appPermission.VIEW_EXPORT_BILL,
        // this.appPermission.VIEW_OUTWARD_LC,
        // this.appPermission.VIEW_OUTWARD_MT202,
        // this.appPermission.VIEW_OUTWARD_MT103,
        // this.appPermission.VIEW_OUTWARD_MT734,
        // this.appPermission.VIEW_OUTWARD_MT999,
        // this.appPermission.VIEW_OUTWARD_MT799,
        // this.appPermission.VIEW_OUTWARD_MT720_1,
        // this.appPermission.VIEW_EMAIL_REPORT,
        // this.appPermission.CHECKER_EXPORT_LC,
        // this.appPermission.CHECKER_INWARD_MT_103,
        // this.appPermission.CHECKER_EXPORT_BILL,
        // this.appPermission.CHECKER_OUTWARD_LC,
        // this.appPermission.CHECKER_OUTWARD_MT202,
        // this.appPermission.CHECKER_OUTWARD_MT103,
        // this.appPermission.CHECKER_OUTWARD_MT734,
        // this.appPermission.CHECKER_OUTWARD_MT999,
        // this.appPermission.CHECKER_OUTWARD_MT799,
        // this.appPermission.CHECKER_OUTWARD_MT720_1,
        // this.appPermission.MAKER_EXPORT_LC,
        // this.appPermission.MAKER_INWARD_MT_103,
        // this.appPermission.MAKER_EXPORT_BILL,
        // this.appPermission.MAKER_OUTWARD_LC,
        // this.appPermission.MAKER_OUTWARD_MT202,
        // this.appPermission.MAKER_OUTWARD_MT103,
        // this.appPermission.MAKER_OUTWARD_MT734,
        // this.appPermission.MAKER_OUTWARD_MT999,
        // this.appPermission.MAKER_OUTWARD_MT799,
        // this.appPermission.MAKER_OUTWARD_MT720_1,
        // this.appPermission.VIEW_CUSTOMER,
        // this.appPermission.VIEW_EMAIL_GROUP,
        // this.appPermission.VIEW_CONTACT_GROUP,
        // this.appPermission.APPROVE_CUSTOMER,
        // this.appPermission.DELETE_CUSTOMER,
        // this.appPermission.VIEW_CONTACT_GROUP,
        this.appPermission.SIGNATURE_MAKER,
        this.appPermission.SIGNATURE_VIEWER,
        this.appPermission.SIGNATURE_DELETER,
        this.appPermission.UPDATE_SIGNATURE,
        this.appPermission.UPLOAD_SIGNATURE,
        this.appPermission.APPROVE_SIGNATURE,
        this.appPermission.DOWNLOAD_SIGNATURE,
        this.appPermission.VIEW_DASHBOARD,
      ])
  }

  showDashboardMenuUserAdmin() {
    return this.permissioinStoreService.hasAnyPermission(
      [
        this.appPermission.USER_VIEWER,
        this.appPermission.USER_MAKER,
        this.appPermission.VIEW_ROLE,
        this.appPermission.MAKE_ROLE,
        this.appPermission.USER_APPROVER,
      ])
  }


  public closeAlert(alert: any) {
    const index: number = this.alerts.indexOf(alert);
    this.alerts.splice(index, 1);
  }

  inboundState = [];
  outboundState = [];

  branchInboundState = [];
  branchOutboundState = [];


  onResponse(service: Service, req: any, response: any) {
    this.loading = false;
    debugger
    if (response.header.referance == 'dashboard_list') {
      console.log(response);
      this.dashbordLoading = false;

      this.dahsbordDetails = response.payload;
      const order = { ACTIVE: 1, IN_ACTIVE: 2, CANCELED: 3 };
    this.dahsbordDetails.sort((a: any, b: any) => order[a.status] - order[b.status]);
    }

  }
  onError(service: Service, req: any, response: any) {
    console.log('error', response);
    this.loading = false;
    this.dashbordLoading = false;
    this.showSearchProgress = false;
  }
}
