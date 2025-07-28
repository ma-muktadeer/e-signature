import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CommonService } from '../softcafe/common/common.service';
import { Service } from '../softcafe/common/service';
import { ActionType } from '../softcafe/constants/action-type.enum';
import { ContentType } from '../softcafe/constants/content-type.enum';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  EMAIL_GROUP = "EMAIL_GROUP"
  CONTACT_GROUP = "CONTACT_GROUP"
 
  constructor(private cs: CommonService) { }

  
  save(name, type, groupId) {
    var payload = {
      name: name,
      type: type,
      groupId:groupId,
    }
    return this.cs.executeAdmin(ActionType.SAVE, ContentType.Group, payload)
  }

  load(type) {
    var payload = {
      type: type
    }
    return this.cs.executeAdmin(ActionType.SELECT_BY_TYPE, ContentType.Group, payload)
  }

  loadStatus(type, status) {
    var payload = {
      type: type,
      status: status,
    }
    return this.cs.executeAdmin(ActionType.SELECT_BY_TYPE_STATUS, ContentType.Group, payload)
  }


  //grupId, type , group.type, user.userId
  unmapOne(groupId, type, toId){
    var group = {
      groupId : groupId,
      type : type,
      toId : toId
    }
    return this.cs.executeAdmin(ActionType.UNMAP_ONE, ContentType.Group, group)
  }
 
  onRemoveCustomer(customerId){
    debugger
    var palaod = {
      customerId : customerId,
    }
    return this.cs.executeAdmin(ActionType.REMOVE_SELECTED_GROUP_CUSTOMER, ContentType.Group, palaod)
  }

  mapUserToGroup(groupId, type,  userList){
    var palaod = {
      mapList : userList,
      groupId : groupId,
      type : type
    }
    return this.cs.executeAdmin(ActionType.MAP_NEW, ContentType.Group, palaod)
  }

  mapMtToGroup(groupId, type,  mtList){
    var palaod = {
      mapList : mtList,
      groupId : groupId,
      type : type
    }
    return this.cs.executeAdmin(ActionType.MAP_NEW, ContentType.Group, palaod)
  }

  loadGroupUsers(group) {
    return this.cs.executeAdmin(ActionType.SELECT_GROUP_USERS, ContentType.Group, group)
  }

  loadGroupCustomer(group) {
     return this.cs.executeAdmin(ActionType.SELECT_GROUP_CUSTOMER, ContentType.Group, group)
  }

  loadGroupMt(group) {
    return this.cs.executeAdmin(ActionType.SELECT_GROUP_MT, ContentType.Group, group)
  }

  loadUnmappedGroupUsers(group) {
    return this.cs.executeAdmin(ActionType.SELECT_UNMAPED_GROUP_USERS, ContentType.Group, group)
  }

  loadUnmappedGroupMt(group) {
    return this.cs.executeAdmin(ActionType.SELECT_UNMAPED_GROUP_MT, ContentType.Group, group)
  }
  
  getType(type) {
    return type == 1 ? this.EMAIL_GROUP : this.CONTACT_GROUP
  }

  approve(payload){
    return this.cs.executeAdmin(ActionType.APPROVE, ContentType.Group, payload)
  }
}
