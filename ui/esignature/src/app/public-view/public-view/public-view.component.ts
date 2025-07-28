import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivityLogService } from 'src/app/layout/activity-log/activity-log.service';
import { ActivityType } from 'src/app/layout/activity-log/activity-type';
import { Softcafe } from 'src/app/softcafe/common/Softcafe';
import { CommonService } from 'src/app/softcafe/common/common.service';
import { Service } from 'src/app/softcafe/common/service';
import { ActionType } from 'src/app/softcafe/constants/action-type.enum';
import { ContentType } from 'src/app/softcafe/constants/content-type.enum';
import Swal from 'sweetalert2';
import { app } from '../../softcafe/common/App';

@Component({
  selector: 'app-public-view',
  templateUrl: './public-view.component.html',
  styleUrls: ['./public-view.component.scss']
})
export class PublicViewComponent extends Softcafe implements Service, OnInit {
  link: any;
  signatureInfo: any;
  imageSrc: any;

  app = app;
  user: any;

  constructor(
    private router: Router,
    private cs: CommonService,
    private activityLogService: ActivityLogService
  ) {
    super();
    let value = this.router.getCurrentNavigation().extractedUrl?.queryParams;
    console.log(value);

    if (value['link']) {
      this.link = value['link'];
      // this.checkIsApplicationUser(this.link['link']);
      this.loadSignatureInformation(this.link);
    }
    else {
      router.navigate(['/login']);
    }
  }
  ngOnInit(): void {
    this.user = this.cs.loadLoginUser();
  }


  loadSignatureInformation(link: any) {

    const payload = {
      publicLink: link,
    }

    this.cs.sendRequestPublic(this, ActionType.SEARCH, ContentType.Request, 'SEARCH', payload);
  }

  stFormatting(st: string): string {
    // console.log('st: ', st);
    const str = st.replace(/_/g, ' ')
    // console.log('str: ', str);
    return str;
  }

  goBack() {
    debugger
    this.router.navigate(['/login']);
  }
  onResponse(service: Service, req: any, res: any) {
    debugger
    if (!this.isOK(res)) {
      Swal.fire({
        icon: 'error',
        text: this.getErrorMsg(res),
        timer: 5000,
      }).then(() => this.router.navigate(['/login']));
      return;
    }
    else if (res.header.referance === 'CHECK_USER') {
      const user = res.payload;
      if (user) {
        this.router.navigate(['/login'], { queryParams: { isUser: true, link: this.link['link'] } });
      }

    }
    else if (res.header.referance === 'SEARCH') {
      console.log(res.payload);
      if (res.payload) {
        this.signatureInfo = res.payload;

        // this.imageStatus = 

        // this.imageSrc = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' 
        //          + this.signatureInfo.base64Image);

        // this.imageSrc = 'data:image/jpeg;base64, '+this.signatureInfo.base64Image;
        // console.log('image path is: ', this.imageSrc);

        this.imageSrc = this.signatureInfo.base64Image;

        this.activityLogService.saveSignatureActivity(ActivityType.VIEW_SIGNATURE, this.signatureInfo.signatureId, this.user?.email ?? this.signatureInfo?.sendingEmail);


      }
    }

  }
  onError(service: Service, req: any, res: any) {
    console.log('error');
  }



}
