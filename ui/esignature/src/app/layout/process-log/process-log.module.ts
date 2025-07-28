import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProcessLogRoutingModule } from './process-log-routing.module';
import { LogComponent } from './log/log.component';


@NgModule({
  declarations: [LogComponent],
  imports: [
    CommonModule,
    ProcessLogRoutingModule
  ]
})
export class ProcessLogModule { }
