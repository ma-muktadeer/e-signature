import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AttendanceRoutingModule } from './attendance-routing.module';
import { AttendanceListComponent } from './attendance-list/attendance-list.component';

@NgModule({
  imports: [
    CommonModule,
    AttendanceRoutingModule
  ],
  declarations: [AttendanceListComponent]
})
export class AttendanceModule { }
