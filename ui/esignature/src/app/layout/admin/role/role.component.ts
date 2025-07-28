import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent extends Softcafe implements OnInit, Service, AfterViewInit {
  spinnerSave = false
  spinnerAddSave = false
  roleBtnDisabled = false
  roleBtnAddDisabled = false
  permissionList = [];
  filteredPermissionList = [];
  roleList = [];
  filtedRoleList = []
  displayStyle = "none";
  buttonSaveOrUpdate;
  displayName = [];
  desc = []
  clickedItem = null;
  roleId
  unassignRoleList: any;
  assignRoleList: any;
  // unassignPermissionList: any;
  // assignPermissionList: any;
  roleForm: FormGroup;

  unassignPermissionList = []; 
  assignPermissionList = [];  
  selectedRoles: any[] = [];
  selectedList: string = '';
  showRoleGroupAssignSave = false;

  isHide: string[] = ['PBL_ADMIN_USER'];
  rollConfigList: any;
  displayNameMaxLength: null;
  descMaxLength: null;


  constructor(
    private activeRoute: ActivatedRoute,
    private fb: FormBuilder,
    private cs: CommonService,
    public userService: UserService,
    private cdf: ChangeDetectorRef,
    public permissioinStoreService: PermissioinStoreService) {
    super();
    this.initRoleGroupForm();
  }

  ngOnInit(): void {
    this.loadCharecterMaxLengthConfig();
    // this.showRoleGroupAssignSave = this.permissioinStoreService.hasPermission(this.permissioinStoreService.appPermission.SAVE_USER)
    this.onLoad();
    this.onLoadPermissionsList();
  }
  ngAfterViewInit(): void {
    this.cdf.detectChanges();
  }

  initRoleGroupForm() {
    this.roleForm = this.fb.group({
      displayName: [null, [Validators.required]],
      roleType: ['', [Validators.required]],
      roleId: [null],
      desc: [null]
    })
  }



  onAddRole() {
    this.roleForm.reset();
    this.roleId = null
    this.displayStyle = "block"
    this.buttonSaveOrUpdate = "Save"
  }

  onDelete(e, group) {
    debugger
    // var payload = this.gridObj.getDataItem(args.row);
    e.stopPropagation();

    Swal.fire({
      text: `Want to Submit?`,
      // title: 'Are you sure want to delete this role?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        // payload.userId = payload.userId
        // payload.allowLogin = payload.allowLogin == 'No' ? 1 : 0;
        // this.cs.sendRequestAdmin(this, ActionType.DELETE, ContentType.User, 'onDeleteBtnClick', payload);
        var payload = {
          roleId: group.roleId
        }
        return this.cs.sendRequestAdmin(this, ActionType.DELETE, ContentType.Role, 'DELETE', payload)
      }
    });

  }

  onClickGroupItem(e, group) {

    debugger
    this.clickedItem = group;
    console.log(this.clickedItem)
    return this.cs.sendRequestAdmin(this, ActionType.SELECT_ROLE_WITH_PERMISSION, ContentType.Role, 'SELECT_ROLE_WITH_PERMISSION', group)
  }
  getItemBackgroupColor(group) { }

  onEdit(e, role) {
    debugger
    e.stopPropagation();
    this.roleId = role.roleId
    this.displayName = role.displayName
    this.desc = role.desc

    this.roleForm.reset()

    var pt = {
      roleId: role.roleId,
      displayName: role.displayName,
      desc: role.desc,
      roleType: role?.roleType ?? null,
    }

    this.roleForm.patchValue(pt);
    this.displayStyle = "block"
    this.buttonSaveOrUpdate = "Update"
  }

  onSave() {
    debugger
    if (this.spinnerAddSave) {
      return
    }
    Swal.fire({
      text: `Want to Submit?`,
      // title: 'Are you sure want to delete this role?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      cancelButtonText: 'No'
    }).then((res) => {
      if (res.isConfirmed) {
        var payload = this.roleForm.value
        payload.roleId = this.roleId
        this.spinnerAddSave = true
        this.roleBtnAddDisabled = true
        this.displayStyle = "none";
        this.buttonSaveOrUpdate = null;
        this.cs.sendRequestAdmin(this, ActionType.SAVE, ContentType.Role, 'SAVE', payload);
      }
    });

  }

  onLoad() {
    this.cs.sendRequestAdmin(this, ActionType.SELECT, ContentType.Role, 'FindAll', {});
  }

  onLoadPermissionsList() {
    this.cs.sendRequestAdmin(this, ActionType.SELECT, ContentType.AppPermission, 'FindAllPermission', {});
  }

  allowApprove(group) {
    return this.hasRole(this.userService.userAdminChekerRoles) && group.status != 'APPROVED' && group.creatorId != this.cs.getUserId()
  }



  closePopup() {
    this.displayStyle = "none";
    this.buttonSaveOrUpdate = null;
    this.displayName = null;
    this.desc = null;
    this.roleForm.reset();
    this.roleId = null;
  }

  toggleSelection(role: any, event: MouseEvent) {

    const inAvailableList = this.unassignPermissionList.includes(role);
    const inAssignedList = this.assignPermissionList.includes(role);

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

 
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      if (this.selectedRoles.length > 0) {
        
        this.selectedRoles.forEach(role => {
          transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousContainer.data.indexOf(role),
            event.currentIndex
          );
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
  onApprove(e, group) {
    e.stopPropagation();
    Swal.fire({
      text: `Want to Submit?`,
      // title: 'Are you sure want to delete this role?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      cancelButtonText: 'No'
    }).then((res) => {
      if (res.isConfirmed) {
        this.cs.sendRequestAdmin(this, ActionType.APPROVE, ContentType.Role, "Approved", group);
      }
    });
  }

  unassignPermissionListAll = []
  onSearchPermission(e, terget) {
    console.log(e)
    if (terget == 'UN') {
      if (!e.target.value) {
        this.unassignPermissionList = this.unassignPermissionListAll
      }
      else {
        this.unassignPermissionList = this.unassignPermissionListAll.filter(x =>
          x.displayName.toUpperCase().indexOf(e.target.value.toUpperCase()) > -1 ||
          x.permissionName.toUpperCase().indexOf(e.target.value.toUpperCase()) > -1

        )
      }
    }

    this.unassignPermissionList = this.unassignPermissionList.filter(x => this.assignPermissionList.every(y => y.permissionId != x.permissionId))

  }


  onSaveRoleManage() {
    debugger
    if (this.spinnerSave) {
      return;
    }
    var payload = {
      permissionList: this.assignPermissionList,
      unassignedPermissionList: this.unassignPermissionList,
      roleId: this.clickedItem.roleId

    }

    this.spinnerSave = true;
    this.roleBtnDisabled = true;
    this.cs.sendRequestAdmin(this, ActionType.MANAGE_ROLE_PERMISSION, ContentType.Role, 'MANAGE_ROLE_GROUP', payload);
  }
  onRoleSearch(e) {
    console.log(e)
    if (!e.target.value) {
      this.filtedRoleList = this.roleList
    }
    else {
      this.filtedRoleList = this.roleList.filter(x => x.displayName.toUpperCase().indexOf(e.target.value.toUpperCase()) > -1)
    }


  }
  user
  onApprovePermission(permission) {
    debugger

    var role = this.clickedItem

    role['appPermissionList'] = [permission]
    this.cs.sendRequest(this, ActionType.APPROVE_PERMISSION, ContentType.Role, 'APPROVE_PERMISSION', role);
  }

  onApproveDeassign(permission) {
    debugger
    var role = this.clickedItem

    role['appPermissionList'] = [permission]
    this.cs.sendRequest(this, ActionType.APPROVE_DEASSIGN_PERMISSION, ContentType.Role, 'APPROVE_DEASSIGN_PERMISSION', role);
  }

  onUndoAssignDeAssign(role) {
    debugger
    // Working
    if (role.genericMapStatus == "PEND_ASSIGN") {
      this.onApproveDeassign(role);
    } else if (role.genericMapStatus == "PEND_DEASSINED") {
      this.onApprovePermission(role);
    }
  }

  loadCharecterMaxLengthConfig() {
    const payload = {
      // configGroup: 'ROLL_FORM_SETUP',
      configSubGroup: 'ROLE_FORM_SETUP',
    }
    this.cs.sendRequest(this, ActionType.SELECT_ALL_CHARACTER_MAX_LENGTH, ContentType.SConfiguration, "MAX_LENGTH_CONGIG_SETUP", payload);
  }
  onResponse(service: Service, req: any, res: any) {
    this.spinnerSave = false
    this.spinnerAddSave = false
    this.roleBtnAddDisabled = false
    this.roleBtnDisabled = false

    if (!super.isOK(res)) {
      Swal.fire(super.getErrorMsg(res));
      return;
    }

    debugger
    if (res.header.referance == 'FindAll') {
      this.roleList = res.payload
      this.filtedRoleList = res.payload
      console.log(res);
    }
    else if (res.header.referance == 'SAVE') {
      Toast.show("Role Saved");
      this.onLoad();
    }
    else if (res.header.referance == 'Approved') {
      Toast.show("Role Approved");
      this.onLoad();
    }
    else if (res.header.referance == 'DELETE') {
      Toast.show("Delete Successful.");
      this.onLoad();
    }
    else if (res.header.referance == 'SELECT_ROLE_WITH_PERMISSION') {
      console.log(res);

      var role = res.payload
      this.assignPermissionList = role.permissionList;
      this.unassignPermissionList = role.unassignedPermissionList;
      this.unassignPermissionListAll = role.unassignedPermissionList;

    }

    else if (res.header.referance == 'MANAGE_ROLE_GROUP') {
      console.log(res)
      var role = res.payload
      this.assignPermissionList = role.permissionList;
      this.unassignPermissionList = role.unassignedPermissionList;
      this.unassignPermissionListAll = role.unassignedPermissionList;
      Toast.show("Role Saved");
      this.onClickGroupItem(null, this.clickedItem);
    }
    else if (res.header.referance == 'APPROVE_DEASSIGN_PERMISSION') {
      Swal.fire({ title: "Successfully De-Assigned Permission", toast: true, timer: 5000 });
      this.onClickGroupItem(null, this.clickedItem);
    }
    else if (res.header.referance == 'APPROVE_PERMISSION') {
      Swal.fire({ title: "Successfully Approve Permission ", toast: true, timer: 5000 });
      this.onClickGroupItem(null, this.clickedItem);
    }
    else if (res.header.referance == 'FindAllPermission') {
      console.log(res);
      this.permissionList = res.payload
      this.filteredPermissionList = res.payload
      console.log(this.permissionList);
    }

    else if (res.header.referance === 'MAX_LENGTH_CONGIG_SETUP') {
      console.log('Roll Config Setup Response:', res);
      console.log('Reference:', res.header.referance);
      debugger
      this.rollConfigList = res.payload;
      this.displayNameMaxLength = null;
      this.descMaxLength = null;

      this.rollConfigList.forEach(config => {
        console.log('Checking CONFIG_SUB_GROUP:', config.CONFIG_SUB_GROUP);
        if (config.value5
          === 'displayName') {
          this.displayNameMaxLength = config.value1;
          console.log('Set displayNameMaxLength to:', this.displayNameMaxLength);
        } else if (config.value5
          === 'desc') {
          this.descMaxLength = config.value1;
          console.log('Set descMaxLength to:', this.descMaxLength);
        }
      });

      this.roleForm.get('displayName').updateValueAndValidity();
      this.roleForm.get('desc').updateValueAndValidity();
    }
  }
  onError(service: Service, req: any, res: any) {
    console.log(res);
    throw new Error('Method not implemented.');
  }

  hasRole(role) {
    return this.cs.hasAnyRole(role);
  }
}
