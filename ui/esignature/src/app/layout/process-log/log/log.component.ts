import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/softcafe/common/common.service';
import { ActionType } from 'src/app/softcafe/constants/action-type.enum';
import { ContentType } from 'src/app/softcafe/constants/content-type.enum';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss']
})
export class LogComponent implements OnInit {

  fileLog = []

  constructor(private cs: CommonService) { }

  ngOnInit(): void {
    this.fileCount();
  }

  fileCount(){
    var payload = {};
    this.cs.execute(ActionType.FILE_COUNT, ContentType.ProcessLog, payload).subscribe((res : any)=>{
      this.fileLog = res.payload;
    });
  }

}
