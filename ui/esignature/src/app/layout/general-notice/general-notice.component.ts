import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { blockToCamel } from 'src/app/service/BlockToCamel';
import { Softcafe } from 'src/app/softcafe/common/Softcafe';
import { CommonService } from 'src/app/softcafe/common/common.service';
import { Service } from 'src/app/softcafe/common/service';
import { ActionType } from 'src/app/softcafe/constants/action-type.enum';
import { ContentType } from 'src/app/softcafe/constants/content-type.enum';

@Component({
  selector: 'app-general-notice',
  templateUrl: './general-notice.component.html',
  styleUrls: ['./general-notice.component.scss'],

})
export class GeneralNoticeComponent extends Softcafe implements OnInit, Service {

  noticeDetailsValue: any[];

  timeInterval = 60 * 60000;
  notice: string;
  detailsValue: any[] = [];
  inactiveValue: any[];
  cencelValue: any[];

  rqTimer
  constructor(private cs: CommonService,
    private bsService: BsModalService,) {
    super();
  }

  ngOnInit(): void {
    // this.loadDashboard();
    this.loadDetailsValue();

  }

  loadDashboard() {
    var payload = {
      branchId: this.cs.loadLoginUser().branchId
    }
    this.cs.sendRequest(this, ActionType.PBL_DASHBOARD, ContentType.Signature, 'dashboard_list', payload);

    if (this.rqTimer) {
      clearInterval(this.rqTimer);
    }
    this.rqTimer = setInterval(() => {
      console.log("Getting dashboard data...");
      this.cs.sendRequest(this, ActionType.PBL_DASHBOARD, ContentType.Signature, 'dashboard_list', payload);
    }, this.timeInterval);
  }

  loadDetailsValue() {
    let payload = {};
    this.cs.sendRequest(this, ActionType.LOAD_DETAILS, ContentType.SignatureInfo, 'LOAD_DETAILS', payload);
  }

  block2CamaleCase(status: string) {
    return blockToCamel(status);
  }

  fomateDate(date: string): string[] {
    try {
      let [dt, time] = date.split(' ');
      dt = dt.replace(/-/g, '/');
      let formattedTime = new Date(`2000-01-01T${time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      return [dt, formattedTime];
    } catch (error) {
      return [date];
    }
  }

  fomateDate2(date: string): string[] {
    try {
      let [dt] = date.split(' ');
      dt = dt.replace(/-/g, '/');
      return [dt];
    } catch (error) {
      return [date];
    }
  }
  

  onResponse(service: Service, req: any, response: any) {

    if (response.header.referance == 'dashboard_list') {
      console.log(response);

      this.noticeDetailsValue = response.payload;
      if (this.noticeDetailsValue) {
        // let n = this.noticeDetailsValue.map(m => {
        //   let notice: string[] = [];
        //   if (m.status === 'IN_ACTIVE') {
        //     notice.push(`Total In-Active Count: ${m.count}`);
        //   } else if (m.status === 'CANCELED') {
        //     notice.push(`Total Cancel Count: ${m.count}`);
        //   }
        //   else {
        //     notice = null;
        //   }
        //   return notice;
        // });
        let list = this.noticeDetailsValue.filter(m => m.status === 'CANCELED' || m.status === 'IN_ACTIVE');

        let n = list.map(m => {
          if (m.status === 'IN_ACTIVE') {
            return `Total In-Active Count: ${m.count}`;
          } else if (m.status === 'CANCELED') {
            return `Total cancel Count: ${m.count}`
          }
        });

        this.notice = n.join('; ')
      }
    }
    else if (response.header.referance == 'LOAD_DETAILS') {
      this.detailsValue = response.payload;
      console.log('LOAD_DETAILS', this.detailsValue);
      // if (this.detailsValue.length>0) {
      //   this.separateByStatus(this.detailsValue);
      // }
    }
  }
  separateByStatus(detailsValue: any[]) {
    this.cencelValue = detailsValue.filter(f => f.signatureStatus === 'CANCELED');
    this.inactiveValue = detailsValue.filter(f => f.signatureStatus === 'IN_ACTIVE');
    this.openModal();
  }
  onError(service: Service, req: any, res: any) {
    console.log('error', res);
  }


  //popup section

  @ViewChild('template')
  template!: TemplateRef<any>
  // private bsService: BsModalService;

  modalRef: BsModalRef;
  openModal() {
    // this.rejectedData = data;
    this.modalRef = this.bsService.show(this.template, { class: 'modal-lg' });
  }

  closeModale() {
    // this.rejectionCause = null;
    // this.rejectedData = [];
    this.modalRef?.hide();
    // this.status = null;
  }
}
