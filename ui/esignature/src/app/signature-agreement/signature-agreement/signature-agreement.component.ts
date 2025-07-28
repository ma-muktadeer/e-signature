import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Softcafe } from 'src/app/softcafe/common/Softcafe';
import { CommonService } from 'src/app/softcafe/common/common.service';
import { Service } from 'src/app/softcafe/common/service';
import { ActionType } from 'src/app/softcafe/constants/action-type.enum';
import { ContentType } from 'src/app/softcafe/constants/content-type.enum';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signature-agreement',
  templateUrl: './signature-agreement.component.html',
  styleUrls: ['./signature-agreement.component.scss']
})
export class SignatureAgreementComponent extends Softcafe implements Service, OnInit {

  agreement: boolean = false;
  isFirstAccept: boolean = false;
  agreementList: any[] = [];
  nextPage: boolean = false;
  infoTitle: string = 'General Notic';

  constructor(private router: Router, private cs: CommonService) {
    super();
  }


  ngOnInit(): void {
    const agreementValue = localStorage.getItem('agreement');
    if (agreementValue && agreementValue == 'true') {
      this.router.navigate(['signature/signature-view']);
    }
    this.loadAgreement();
  }

  firstAccept() {
    const loginId: number = this.cs.loadLoginUser()?.loginId;
    console.log('login user id: ', loginId);
    const payload = {
      loginId: loginId,
    };

    this.cs.sendRequest(this, ActionType.FIRST_ACCEPT, ContentType.User, 'FIRST_ACCEPT', payload);

  }
  loadAgreement() {
    const payload = {};

    this.cs.sendRequest(this, ActionType.SELECT_ALL_AGREEMENT, ContentType.DocumentFiles, 'select_all', payload);
  }

  clickContinueBtn() {
    debugger
    const loginId: number = this.cs.loadLoginUser()?.loginId;
    console.log('login user id: ', loginId);
    const payload = {
      loginId: loginId,
    };

    this.cs.sendRequest(this, ActionType.SECOUND_ACCEPT, ContentType.User, 'SECOUND_ACCEPT', payload);

  }


  onResponse(service: Service, req: any, res: any) {
    if (!super.isOK(res)) {
      Swal.fire(super.getErrorMsg(res));
      return;
    }
    if (res.header.referance === 'select_all') {

      const value = res.payload;
      value.forEach(v => {
        if (v?.configSubGroup === "GENERAL_NOTIC_FILE") {
          this.agreementList.unshift(v);
        } else {
          this.agreementList.push(v);
        }
      });

      // this.agreementList = res.payload;

    }
    else if (res.header.referance === 'FIRST_ACCEPT') {
      this.nextPage = true;
      this.infoTitle = 'M.D. Instruction'
    }
    else if (res.header.referance === 'SECOUND_ACCEPT') {

      console.log('Click continue Btn: ', this.agreement);
      if (this.agreement) {
        localStorage.setItem('agreement', `${this.agreement}`);
        this.router.navigate(['/signature/internal/signature-view', { agreement: this.agreement }]);
      } else {
        Swal.fire('Please read the instruction. If ageed then select agreed button & continue.');
        return;
      }

    }
  }
  onError(service: Service, req: any, res: any) {
    throw new Error('Method not implemented.');
  }

}
