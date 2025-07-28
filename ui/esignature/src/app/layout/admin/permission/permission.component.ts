import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PermissioinStoreService } from 'src/app/service/permissioin-store.service';
import { Softcafe } from 'src/app/softcafe/common/Softcafe';
import { Toast } from 'src/app/softcafe/common/Toast';
import { CommonService } from 'src/app/softcafe/common/common.service';
import { Service } from 'src/app/softcafe/common/service';
import { ActionType } from 'src/app/softcafe/constants/action-type.enum';
import { ContentType } from 'src/app/softcafe/constants/content-type.enum';
import Swal from 'sweetalert2';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.scss']
})
export class PermissionComponent extends Softcafe implements OnInit, Service {

  permissionList = [];
  filteredPermissionList = [];
  displayStyle = "none";
  buttonSaveOrUpdate;
  roleGroupName = [];
  clickedItem = null;
  roleGroupId
  // unassignRoleList: any;
  // assignRoleList: any;
  roleGroupForm: FormGroup;
  displayName
  desc
  permissionId
  disableAddSave = false
  spinnerAddSave = false
  spinnerAssignSave = false
  permissionBtnDisabled = false
  user : any;
  showRoleGroupAssignSave = false;
  permissionConfigList: any;
descMaxLength: any;
displayNameMaxLength: any;

unassignRoleList = []; 
  assignRoleList = [];   
  selectedRoles: any[] = [];
  selectedList: string = '';

  
  constructor(
    private activeRoute: ActivatedRoute,
    private fb: FormBuilder,
    private cs: CommonService,
    public userService : UserService,
    public permissioinStoreService : PermissioinStoreService) {
    super();
    this.initRoleGroupForm();
  }

  ngOnInit(): void {
    this.loadCharecterMaxLengthConfig();
    this.user = this.userService.getCurrentUser();
    var payload = this.user;
    // if(this.permissioinStoreService.hasPermission(AppPermission.APPROVE_PERMISSION)){
    //   this.showRoleGroupAssignSave = true
    // }
    this.onLoad();
  }
  loadCharecterMaxLengthConfig() {
    const payload = {
      configSubGroup: 'PERMISSION_FORM_SETUP',
    }
    this.cs.sendRequest(this, ActionType.SELECT_ALL_CHARACTER_MAX_LENGTH, ContentType.SConfiguration, "MAX_LENGTH_CONGIG_SETUP", payload);
  }

  initRoleGroupForm() {
    this.roleGroupForm = this.fb.group({
      roleGroupName: [null, Validators.required],
    })
  }

  onEdit(e , group){
    debugger
    this.permissionId = group.permissionId
    this.displayName = group.displayName
    this.desc = group.desc
    e.stopPropagation();
    this.displayStyle = "block"
  }

 
  unassignPermissionListAll = []
  onSearchPermission(e, terget){
    debugger
    console.log(e)
    if(terget == 'UN'){
      if(!e.target.value){
        this.unassignRoleList = this.unassignPermissionListAll
      }
      else{
        this.unassignRoleList = this.unassignPermissionListAll.filter(x => 
          x.displayName.toUpperCase().indexOf(e.target.value.toUpperCase()) > -1 
          )
      }
    }
  }

  onSave(){
    if (this.spinnerAddSave) {
      return
    }
    var payload = {
      permissionId : this.permissionId,
      displayName : this.displayName,
      desc : this.desc
    }
    this.displayStyle = "none"
    this.spinnerAddSave = true
    this.disableAddSave = true
    return this.cs.sendRequestAdmin(this, ActionType.SAVE, ContentType.AppPermission, 'SAVE', payload)
   
  }

 

  onAddRoleGroup() {
    this.roleGroupForm.reset();
    this.roleGroupId = null
    this.displayStyle = "block"
    this.buttonSaveOrUpdate = "Save"
  }

  onClickPermissionItem(e, group) {

    debugger
    this.clickedItem = group;
    return this.cs.sendRequestAdmin(this, ActionType.SELECT_PERMISSION_ROLE, ContentType.AppPermission, 'SELECT_PERMISSION_ROLE', group)
  }
  getItemBackgroupColor(group) { }

  onLoad() {
    this.cs.sendRequestAdmin(this, ActionType.SELECT, ContentType.AppPermission, 'FindAll', {});
  }


  closePopup() {
    this.displayStyle = "none";
    this.buttonSaveOrUpdate = null;
    this.roleGroupName = null;
    this.roleGroupForm.reset();
    this.roleGroupId = null;
  }

  // drop(event: CdkDragDrop<string[]>) {
  //   debugger
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


  onRoleSave() {
    debugger
    if (this.spinnerAssignSave) {
      return;
    }
    var payload = {
      roleList: this.assignRoleList,
      unassignRoleList: this.unassignRoleList,
      permissionId: this.clickedItem.permissionId

    }

    this.cs.sendRequestAdmin(this, ActionType.MANAGE_APP_PERMISSION, ContentType.AppPermission, 'MANAGE_APP_PERMISSION', payload);
    this.spinnerAssignSave = true
    this.permissionBtnDisabled = true
  }

  onPermissionSearch(e){
    console.log(e)
    if(!e.target.value){
      this.filteredPermissionList = this.permissionList
    }
    else{
      this.filteredPermissionList = this.permissionList.filter(x => x.permissionName.indexOf(e.target.value.toUpperCase()) > -1)
    }
  }

  onResponse(service: Service, req: any, res: any) {
    this.spinnerAddSave = false
    this.disableAddSave = false
    this.spinnerAssignSave = false
    this.permissionBtnDisabled = false
    debugger
    if (res.header.referance == 'FindAll') {
      this.permissionList = res.payload
      this.filteredPermissionList = res.payload
      console.log(res);
    }
    else if (res.header.referance == 'SAVE') {
      Toast.show("Permission Saved");
      this.onLoad();
    }
    else if (res.header.referance == 'APPROVE') {
      Toast.show("Permission Approved");
      this.onLoad();
    }
    else if (res.header.referance == 'SELECT_PERMISSION_ROLE') {
      console.log(res);

      var roleGroup = res.payload
      this.assignRoleList = roleGroup.roleList;
      this.unassignRoleList = roleGroup.unassignRoleList;
      this.unassignPermissionListAll = roleGroup.unassignRoleList;

    }else if (res.header.referance == 'APPROVE_PERMISSION') {
      if(res.payload.length > 0){
        Swal.fire({title:"Successfully APPROVE PERMISSION", toast: true, timer:5000});
        this.user = res.payload[0];
        this.assignRoleList = this.user.roleList;
        this.unassignRoleList = this.user.unassignRoleList;
        this.unassignRoleList = this.unassignRoleList.filter( x => x.status == 'APPROVED');
        // this.filteredUnassignRoleList = this.unassignRoleList 
      }
    }else if (res.header.referance == 'APPROVE_DEASSIGN_PERMISSION') {
      if(res.payload.length > 0){
        Swal.fire({title:"Successfully De-Assigned Role", toast: true, timer:5000});
        this.user = res.payload[0];
        this.assignRoleList = this.user.roleList;
        this.unassignRoleList = this.user.unassignRoleList;
        this.unassignRoleList = this.unassignRoleList.filter( x => x.status == 'APPROVED');
        // this.filteredUnassignRoleList = this.unassignRoleList 
      }
    }

    else if (res.header.referance == 'MANAGE_APP_PERMISSION') {
      console.log(res)
      Toast.show("Permission Saved");
    }
    else if (res.header.referance === 'MAX_LENGTH_CONGIG_SETUP') {
      console.log('Signatory Config Setup Response:', res);
      console.log('Reference:', res.header.referance);
      debugger;
      this.permissionConfigList = res.payload;
    
      const maxLengthMapping = {
        displayNameP: 'displayNameMaxLength',
        descP: 'descMaxLength',
       
      };
    
      this.permissionConfigList.forEach(config => {
        const prop = maxLengthMapping[config.value5];
        if (prop) {
          this[prop] = config.value1;
          console.log(`Set ${prop} to:`, config.value1);
        }
      });
      Object.keys(maxLengthMapping).forEach(field => {
        if (!this[field]) {
          console.warn(`${field} is required.`);

        }
      });

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