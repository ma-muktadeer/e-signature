import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PermissioinStoreService } from 'src/app/service/permissioin-store.service';
import Swal from 'sweetalert2';
import { CommonService } from '../../../softcafe/common/common.service';
import { Service } from '../../../softcafe/common/service';
import { ActionType } from '../../../softcafe/constants/action-type.enum';
import { ContentType } from '../../../softcafe/constants/content-type.enum';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-manage-role-group',
  templateUrl: './manage-role-group.component.html',
  styleUrls: ['./manage-role-group.component.scss']
})
export class ManageRoleGroupComponent implements OnInit, Service, OnDestroy {

  manageRoleBtnDisabled  = false;

  showManageBtn = false;

  user : any;

  roleGroupList : any;
  unassignRoleGroupList : any;

  fullName

  constructor(private cs : CommonService, private us : UserService
    , private router : Router, private userService : UserService,
    private permissioinStoreService : PermissioinStoreService) { }

  ngOnDestroy(){
      this.us.changeCurrentUser({});
    }
  ngOnInit() {

    this.showManageBtn = this.permissioinStoreService.hasPermission(this.permissioinStoreService.appPermission.USER_MAKER)
    debugger
    this.user = this.us.getCurrentUser();
    this.fullName = this.user.loginName
    var payload = this.user;
    this.cs.sendRequestAdmin(this, ActionType.SELECT_SINGLE_WITH_ROLE_GROUP, ContentType.User, 'SELECT_SINGLE_WITH_ROLE_GROUP', payload );
  }

  manageRoleBtnClick(){
    debugger
    this.user.roleGroupList = this.roleGroupList;
    this.user.unassignRoleGroupList  = this.unassignRoleGroupList;
    var payload = this.user;
    this.cs.sendRequestAdmin(this, ActionType.MANAGE_ROLE_GROUP, ContentType.User, 'MANAGE_ROLE_GROUP', payload );
    this.manageRoleBtnDisabled = true;
  }


  backBtnClick(){
    this.router.navigate(["/admin"]);
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }

  onResponse(service : Service, req : any, response: any) {
    console.log('success');
    if(response.header.referance == 'SELECT_SINGLE_WITH_ROLE_GROUP'){
        if(response.payload.length > 0){
          this.user = response.payload[0];
          this.roleGroupList = this.user.roleGroupList;
          this.unassignRoleGroupList = this.user.unassignRoleGroupList;
        }
    }
    else if(response.header.referance == 'MANAGE_ROLE_GROUP'){
      if(response.payload.length > 0){
        this.manageRoleBtnDisabled = false;
        Swal.fire({title:"Successfully managed role group", toast: true, timer:5000})
      }
    }
    
  }
  onError(service : Service , req : any, response: any) {
      console.log('error');
  }

}
