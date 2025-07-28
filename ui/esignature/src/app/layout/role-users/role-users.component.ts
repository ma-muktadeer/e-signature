import { Component, HostListener, OnInit } from '@angular/core';
import { CommonService } from 'src/app/softcafe/common/common.service';
import { Service } from 'src/app/softcafe/common/service';
import { Softcafe } from 'src/app/softcafe/common/Softcafe';
import { ActionType } from 'src/app/softcafe/constants/action-type.enum';
import { ContentType } from 'src/app/softcafe/constants/content-type.enum';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-role-users',
  templateUrl: './role-users.component.html',
  styleUrls: ['./role-users.component.scss']
})
export class RoleUsersComponent extends Softcafe implements OnInit, Service {
  roleList: any[] = [];
  selectedRole: any;
  userPaylodList: any;
  height: number;
  loading: boolean = true;

  constructor(private cs: CommonService) {
    super();
  }

  ngOnInit(): void {
    this.onLoad()
    this.setDynamicHeight();
  }


  onLoad() {
    this.cs.sendRequestAdmin(this, ActionType.SELECT, ContentType.Role, 'FindAll', {});
  }

  loadUsersByName(role: any) {
    this.selectedRole = role;
    let payload = {
      roleList: [role],
    }

    this.cs.sendRequest(this, ActionType.FIND_USER_BY_ROLE, ContentType.User, 'find_user', payload);
  }

  onResponse(service: Service, req: any, res: any) {
    debugger
    this.loading = false;
    if (!super.isOK(res)) {
      Swal.fire(super.getErrorMsg(res));
      return;
    } else if (res.header.referance == 'FindAll') {

      this.roleList = res.payload
      console.log(res);

    } else if (res.header.referance == 'find_user') {

      const payload = {
        content: res.payload,
        total: res.payload.length,
      }
      this.userPaylodList = payload;
    }
  }
  onError(service: Service, req: any, res: any) {
    this.loading = false;
    throw new Error('Method not implemented.');
  }

  @HostListener('window:resize')
  onResize() {
    this.setDynamicHeight();
  }

  setDynamicHeight(): void {
    const headerHeight = 56; // Example header height, adjust as necessary
    const footerHeight = 56; // Example footer height, adjust as necessary
    const windowHeight = window.innerHeight;
    this.height = windowHeight - headerHeight - footerHeight;
  }

}
