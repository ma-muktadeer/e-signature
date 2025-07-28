import { Injectable } from '@angular/core';
import { CommonService } from 'src/app/softcafe/common/common.service';
import { ActionType } from 'src/app/softcafe/constants/action-type.enum';
import { ContentType } from 'src/app/softcafe/constants/content-type.enum';
import { ActivityType } from './activity-type';

@Injectable({
  providedIn: 'root'
})
export class ActivityLogService {

  constructor(private cs : CommonService) { }

  private save(payload){
    this.cs.executePublic(ActionType.SAVE, ContentType.ActivityLog, payload).subscribe((res: any)=>{
      console.log("Activity Tracked")
    });
  }


  saveSignatureActivity(activityType: ActivityType, sigId, email?:string){
    var payload = {
      userId : this.cs.getUserId(),
      onId : sigId,
      email : email,
      activityType : activityType.toString()
    }

    this.save(payload);
  }
}
