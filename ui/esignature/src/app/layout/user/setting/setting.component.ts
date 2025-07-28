import { Component, OnInit, OnChanges } from '@angular/core';
import { Softcafe } from '../../../softcafe/common/Softcafe';
import { Service } from '../../../softcafe/common/service';
import { Validators, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../../../softcafe/common/common.service';
import { UserService } from '../../admin/services/user.service';
import { ContentType } from '../../../softcafe/constants/content-type.enum';
import { ActionType } from '../../../softcafe/constants/action-type.enum';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent extends Softcafe implements OnInit, Service, OnChanges {

  user: any;


  constructor(public fb: FormBuilder, public router: Router, private cs: CommonService, private us: UserService) {
    super();
  }

  ngOnInit() {
    var payload = this.cs.loadLoginUser();
    this.cs.sendRequestAdmin(this, ActionType.SELECT_SINGLE, ContentType.User, 'SELECT_SINGLE', payload);
  }
  ngOnChanges() { }

  toggle2FA(event) {
    var payload = this.user;
    payload.twoFactorAuth = event.checked ? 1 : 0;
    this.cs.sendRequestAdmin(this, ActionType.TOGGLE_2_FA, ContentType.User, 'TOGGLE_2_FA', payload);
  }

  onResponse(service: Service, req: any, response: any) {
    if (!super.isOK(response)) {
      alert(super.getErrorMsg(response));
      return;
    }
    if (response.header.referance == 'SELECT_SINGLE') {
      this.user = response.payload[0];
    }
  }
  onError(service: Service, req: any, response: any) {
    console.log('error');
  }

}
