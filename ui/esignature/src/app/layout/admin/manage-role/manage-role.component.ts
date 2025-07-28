import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppPermission, PermissioinStoreService } from 'src/app/service/permissioin-store.service';
import Swal from 'sweetalert2';
import { CommonService } from '../../../softcafe/common/common.service';
import { Service } from '../../../softcafe/common/service';
import { ActionType } from '../../../softcafe/constants/action-type.enum';
import { ContentType } from '../../../softcafe/constants/content-type.enum';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-manage-role',
  templateUrl: './manage-role.component.html',
  styleUrls: ['./manage-role.component.scss']
})
export class ManageRoleComponent implements OnInit, Service, OnDestroy {

  manageRoleBtnDisabled = false;
  spinnerManage = false
  user: any;
  public appPermission = AppPermission;

  // assignRoleList: any;
  // unassignRoleList: any;

  unassignRoleList = [];
  assignRoleList = [];
  selectedList: string = '';
  selectedRoles: any[] = [];
  loginName
  haveRole: boolean = false;

  constructor(
    private cs: CommonService,
    private us: UserService,
    private router: Router,
    public permissioinStoreService: PermissioinStoreService
  ) { }

  ngOnDestroy() {
    this.us.changeCurrentUser({});
  }
  showSameUserBtn = false
  ngOnInit() {
    this.user = this.us.getCurrentUser();
    var payload = this.user;
    this.loginName = this.user.loginName;
    var user = this.cs.isSameUser(payload.userId);

    if (!user) {
      this.showSameUserBtn = true
    }
    this.cs.sendRequest(this, ActionType.SELECT_SINGLE_WITH_ROLE, ContentType.User, 'SELECT_SINGLE_WITH_ROLE', payload);
  }

  filteredUnassignRoleList = []

  onRoleSearch(e) {
    console.log(e)
    if (!e.target.value) {
      this.filteredUnassignRoleList = this.unassignRoleList
    }
    else {
      this.filteredUnassignRoleList = this.unassignRoleList.filter(x => x.displayName.toUpperCase().indexOf(e.target.value.toUpperCase()) > -1)
    }

    this.filteredUnassignRoleList = this.filteredUnassignRoleList.filter(x => this.assignRoleList.every(y => y.roleId != x.roleId))
  }

  manageRoleBtnClick() {
    if (this.spinnerManage) {
      return
    }
    debugger
    if (!this.haveRole && !this.assignRoleList?.length) {
      return;
    }
    debugger
    this.user.roleList = this.assignRoleList;
    this.user.unassignRoleList = this.unassignRoleList.filter(u => !this.assignRoleList.some(s => s.roleId === u.roleId));
    var payload = this.user;
    this.cs.sendRequest(this, ActionType.MANAGE_ROLE, ContentType.User, 'MANAGE_ROLE', payload);
    this.spinnerManage = true
    this.manageRoleBtnDisabled = true;
  }

  onApprove(role) {
    this.user.roleList = [];
    this.user.roleList.push(role);
    var payload = this.user;
    this.cs.sendRequest(this, ActionType.APPROVE_ROLE, ContentType.User, 'APPROVE_ROLE', payload);
  }

  onApproveDeassign(role) {
    this.user.roleList = [];
    this.user.roleList.push(role);
    var payload = this.user;
    this.cs.sendRequest(this, ActionType.APPROVE_DEASSIGN, ContentType.User, 'APPROVE_DEASSIGN', payload);
  }
  onUndoAssignDeAssign(role) {
    // Working
    if (role.genericMapStatus == "PEND_ASSIGN") {
      this.onApproveDeassign(role);
    } else if (role.genericMapStatus == "PEND_DEASSINED") {
      this.onApprove(role);
    }
  }

  backBtnClick() {
    this.router.navigate(["/admin"]);
  }

  // drop(event: CdkDragDrop<string[]>) {

  //   if (!this.permissioinStoreService.hasAnyPermission([AppPermission.USER_MAKER])) {
  //     return;
  //   }
  //   if (event.previousContainer === event.container) {
  //     moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  //   } else {
  //     transferArrayItem(event.previousContainer.data,
  //       event.container.data,
  //       event.previousIndex,
  //       event.currentIndex);
  //   }
  // }

  toggleSelection(role: any, event: MouseEvent) {
    const inAvailableList = this.unassignRoleList.includes(role);
    const inAssignedList = this.assignRoleList.includes(role);

    debugger

    if (inAvailableList && this.selectedList === 'assign') {
      this.selectedRoles = [];
    } else if (inAssignedList && this.selectedList === 'available') {
      this.selectedRoles = [];
    }

    if (event.ctrlKey) {
      const index = this.selectedRoles.indexOf(role);
      if (index === -1) {
        this.selectedRoles.push(role);
      } else {
        this.selectedRoles.splice(index, 1);
      }
    } else {
      this.selectedRoles = [role];
    }

    this.selectedList = inAvailableList ? 'available' : 'assign';
  }

  drop(event: CdkDragDrop<any[]>) {
    debugger
    if (!this.permissioinStoreService.hasPermission(AppPermission.USER_MAKER)) {
      Swal.fire({
        icon: 'info',
        title: 'Information',
        text: `Sorry. You don't have to perform this action.`
      });
      return;
    }

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      if (this.selectedRoles.length > 0) {
        this.selectedRoles.forEach(role => {
          const roleIndex = event.previousContainer.data.indexOf(role);
          if (roleIndex !== -1) {
            transferArrayItem(
              event.previousContainer.data,
              event.container.data,
              roleIndex,
              event.currentIndex
            );
          }
        });
        this.selectedRoles = [];
      } else {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
      }
      this.selectedList = '';
    }
  }

  onResponse(service: Service, req: any, response: any) {
    debugger
    console.log('success');
    this.spinnerManage = false
    if (response.header.referance == 'SELECT_SINGLE_WITH_ROLE') {
      if (response.payload.length > 0) {
        this.user = response.payload[0];
        this.assignRoleList = this.user.roleList;
        this.haveRole = this.assignRoleList?.length > 0;
        this.unassignRoleList = this.user.unassignRoleList;
        this.unassignRoleList = this.unassignRoleList.filter(x => x.status == 'APPROVED');
        this.filteredUnassignRoleList = this.unassignRoleList
      }
      console.log(this.assignRoleList)
    }
    else if (response.header.referance == 'MANAGE_ROLE') {
      if (response.payload.length > 0) {
        this.manageRoleBtnDisabled = false;
        Swal.fire({ title: "Successfully managed role", toast: true, timer: 5000 });
        this.user = response.payload[0];
        this.assignRoleList = this.user.roleList;
        this.haveRole = this.assignRoleList?.length > 0;
        this.unassignRoleList = this.user.unassignRoleList;
        this.unassignRoleList = this.unassignRoleList.filter(x => x.status == 'APPROVED');
        this.filteredUnassignRoleList = this.unassignRoleList
      }
    } else if (response.header.referance == 'APPROVE_ROLE') {
      if (response.payload.length > 0) {
        Swal.fire({ title: "Successfully Approved Role", toast: true, timer: 5000 });
        this.user = response.payload[0];
        this.assignRoleList = this.user.roleList;
        this.haveRole = this.assignRoleList?.length > 0;
        this.unassignRoleList = this.user.unassignRoleList;
        this.unassignRoleList = this.unassignRoleList.filter(x => x.status == 'APPROVED');
        this.filteredUnassignRoleList = this.unassignRoleList
      }
    } else if (response.header.referance == 'APPROVE_DEASSIGN') {
      if (response.payload.length > 0) {
        Swal.fire({ title: "Successfully De-Assigned Role", toast: true, timer: 5000 });
        this.user = response.payload[0];
        this.assignRoleList = this.user.roleList;
        this.haveRole = this.assignRoleList?.length > 0;
        this.unassignRoleList = this.user.unassignRoleList;
        this.unassignRoleList = this.unassignRoleList.filter(x => x.status == 'APPROVED');
        this.filteredUnassignRoleList = this.unassignRoleList
      }
    } else if (response.header.referance == 'UNDO_ASSIGN_DEASSIGN') {
      if (response.payload.length > 0) {
        Swal.fire({ title: "Successfully Undo Role", toast: true, timer: 5000 });
        this.user = response.payload[0];
        this.assignRoleList = this.user.roleList;
        this.haveRole = this.assignRoleList?.length > 0;
        this.unassignRoleList = this.user.unassignRoleList;
        this.unassignRoleList = this.unassignRoleList.filter(x => x.status == 'APPROVED');
        this.filteredUnassignRoleList = this.unassignRoleList
      }
    }

  }
  onError(service: Service, req: any, response: any) {
    console.log('error');
  }

}
