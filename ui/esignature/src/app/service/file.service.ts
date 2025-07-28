import { Injectable } from '@angular/core';
import { CommonService } from '../softcafe/common/common.service';
import { ActionType } from '../softcafe/constants/action-type.enum';
import { ContentType } from '../softcafe/constants/content-type.enum';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private cs: CommonService) { }

  loadFile2Base64(actionType: ActionType, objectId: number, objectType?: string) {
    const payload = {
      objectId: objectId,
      objectType: objectType,
    }
    return this.cs.execute(actionType, ContentType.DocumentFiles, payload);
  }
}
