import { Injectable } from '@angular/core';
import { CommonService } from '../softcafe/common/common.service';
import { ActionType } from '../softcafe/constants/action-type.enum';
import { ContentType } from '../softcafe/constants/content-type.enum';

@Injectable({
  providedIn: 'root'
})
export class SconfigService {

  constructor(private cs :  CommonService) { }

  selectByGroup(configGroup){
    var payload = {
      configGroup : configGroup
    }
    return this.cs.execute(ActionType.SELECT_1, ContentType.SConfiguration, payload)
  }

  selectByGroupAndSubGroup(configGroup, configSubGroup){
    var payload = {
      configGroup : configGroup,
      configSubGroup : configSubGroup
    }
    return this.cs.execute(ActionType.SELECT_2, ContentType.SConfiguration, payload)
  }

  selectByGroupAndSubGroupConfigName(configGroup, configSubGroup, configName: Array<string>){
    var payload = {
      configGroup : configGroup,
      configSubGroup : configSubGroup,
      configNameList : configName
    }
    return this.cs.execute(ActionType.SELECT_3, ContentType.SConfiguration, payload)
  }
  selectByGroupAndSubGroupConfigNamePublic(configGroup, configSubGroup, configName: Array<string>){
    var payload = {
      configGroup : configGroup,
      configSubGroup : configSubGroup,
      configNameList : configName
    }
    return this.cs.executePublic(ActionType.SELECT_3, ContentType.SConfiguration, payload)
  }

  selectByGroupAndSubGroupStatus(configGroup, configSubGroup, value5){
    var payload = {
      configGroup : configGroup,
      configSubGroup : configSubGroup,
      value5 : value5
    }
    return this.cs.execute(ActionType.ACTION_SELECT_APPROVE, ContentType.SConfiguration, payload)
  }

  save(payload){
    return this.cs.execute(ActionType.SAVE, ContentType.SConfiguration, payload)
  }

  saveApplicationSetup(payload){
    return this.cs.execute(ActionType.SAVE_APPLICATION_SETUP, ContentType.SConfiguration, payload)
  }
  insert(payload){
    return this.cs.execute(ActionType.NEW, ContentType.SConfiguration, payload)
  }

  update(payload){
    return this.cs.execute(ActionType.UPDATE, ContentType.SConfiguration, payload)
  }

  approve(payload){
    return this.cs.execute(ActionType.APPROVE, ContentType.SConfiguration, payload)
  }

}
