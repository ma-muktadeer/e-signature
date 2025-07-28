import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CommonService } from '../softcafe/common/common.service';
import { Service } from '../softcafe/common/service';
import { ActionType } from '../softcafe/constants/action-type.enum';
import { ContentType } from '../softcafe/constants/content-type.enum';

@Injectable({
  providedIn: 'root'
})
export class MtTypeService implements Service {


  mtTypeLoadChanged: BehaviorSubject<Event[]> = new BehaviorSubject<Event[]>([]);

  mtTypeList = [];
  constructor(private cs : CommonService) { 

  }

  loadnMtType(){
    var payload1 = {};
    if(this.mtTypeList.length){
      return;
    }
    this.cs.sendRequestPublic(this, ActionType.SELECT, ContentType.MtType, "MTTYPE_LIST_DROP_DOWN", payload1);

  }


  loadMtTypeAsync(){
    var payload={}
    return this.cs.executePublic(ActionType.SELECT, ContentType.MtType, {});
  }


  onResponse(service : Service, req : any, response: any) {
    console.log(response.payload)
    if (response.header.referance == 'MTTYPE_LIST_DROP_DOWN') {
      this.mtTypeList = response.payload;
      console.log("mtTypeList:::: "+ this.mtTypeList );
      this.mtTypeLoadChanged.next(this.mtTypeList);
    }
  }
  onError(service : Service , req : any, response: any) {
    console.log('error');
  }
}
