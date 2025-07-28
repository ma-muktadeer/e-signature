import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/softcafe/common/common.service';
import { Service } from 'src/app/softcafe/common/service';
import { Softcafe } from 'src/app/softcafe/common/Softcafe';
import { ActionType } from 'src/app/softcafe/constants/action-type.enum';
import { ContentType } from 'src/app/softcafe/constants/content-type.enum';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Toast } from 'src/app/softcafe/common/Toast';
import { AppRole } from 'src/app/softcafe/common/AppRole';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-role-group',
  templateUrl: './role-group.component.html',
  styleUrls: ['./role-group.component.scss']
})
export class RoleGroupComponent extends Softcafe implements OnInit, Service {

  roleGroupList = [];
  displayStyle = "none";
  buttonSaveOrUpdate;
  roleGroupName = [];
  clickedItem = null;
  roleGroupId
  unassignRoleList: any;
  assignRoleList: any;
  roleGroupForm: FormGroup;

  showRoleGroupAssignSave = false;

  
  constructor(
    private activeRoute: ActivatedRoute,
    private fb: FormBuilder,
    private cs: CommonService,
    public userService : UserService) {
    super();
    this.initRoleGroupForm();
  }

  ngOnInit(): void {
    if(this.cs.hasAnyRole(this.userService.userAdminMakerRoles)){
      this.showRoleGroupAssignSave = true
    }
    this.onLoad();
  }

  initRoleGroupForm() {
    this.roleGroupForm = this.fb.group({
      roleGroupName: [null, Validators.required],
    })
  }



  onAddRoleGroup() {
    this.roleGroupForm.reset();
    this.roleGroupId = null
    this.displayStyle = "block"
    this.buttonSaveOrUpdate = "Save"
  }

  onClickGroupItem(e, group) {

    debugger
    this.clickedItem = group;
    return this.cs.sendRequestAdmin(this, ActionType.SELECT_ROLE_GROUP_LIST, ContentType.RoleGroup, 'SELECT_ROLE_GROUP_LIST', group)
  }
  getItemBackgroupColor(group) { }

  onEdit(role) {
    debugger
    this.roleGroupId = role.roleGroupId
    this.roleGroupName = role.roleGroupName
    this.displayStyle = "block"
    this.buttonSaveOrUpdate = "Update"
  }

  onSave() {
    debugger
    var payload = this.roleGroupForm.value
    payload.roleGroupId = this.roleGroupId
    this.cs.sendRequestAdmin(this, ActionType.SAVE, ContentType.RoleGroup, 'SAVE', payload);
    this.displayStyle = "none";
    this.buttonSaveOrUpdate = null;

  }

  onLoad() {
    this.cs.sendRequestAdmin(this, ActionType.SELECT_ALL, ContentType.RoleGroup, 'FindAll', {});
  }

  allowApprove(group){
    return this.hasRole(this.userService.userAdminChekerRoles) && group.status != 'APPROVED' && group.creatorId != this.cs.getUserId()
  }

  

  closePopup() {
    this.displayStyle = "none";
    this.buttonSaveOrUpdate = null;
    this.roleGroupName = null;
    this.roleGroupForm.reset();
    this.roleGroupId = null;
  }

  drop(event: CdkDragDrop<string[]>) {
    debugger
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }
  onApprove(group) { 
    this.cs.sendRequestAdmin(this, ActionType.APPROVE, ContentType.RoleGroup, "Approved", group);
  }


  onSaveRoleManage() {
    debugger
    var payload = {
      roleList: this.assignRoleList,
      unassignRoleList: this.unassignRoleList,
      roleGroupId: this.clickedItem.roleGroupId

    }

    this.cs.sendRequestAdmin(this, ActionType.MANAGE_ROLE_GROUP, ContentType.RoleGroup, 'MANAGE_ROLE_GROUP', payload);
  }

  onResponse(service: Service, req: any, res: any) {
    debugger
    if (res.header.referance == 'FindAll') {
      this.roleGroupList = res.payload
      console.log(res);
    }
    else if (res.header.referance == 'SAVE') {
      Toast.show("Role Group Saved");
      this.onLoad();
    }
    else if (res.header.referance == 'Approved') {
      Toast.show("Role Group Approved");
      this.onLoad();
    }
    else if (res.header.referance == 'SELECT_ROLE_GROUP_LIST') {
      console.log(res);

      var roleGroup = res.payload
      this.assignRoleList = roleGroup.roleList;
      this.unassignRoleList = roleGroup.unassignRoleList;

    }

    else if (res.header.referance == 'MANAGE_ROLE_GROUP') {
      console.log(res)
      Toast.show("Role Group Saved");
    }
  }
  onError(service: Service, req: any, res: any) {
    console.log(res);
    throw new Error('Method not implemented.');
  }

  hasRole(role){
    return this.cs.hasAnyRole(role);
  }
}