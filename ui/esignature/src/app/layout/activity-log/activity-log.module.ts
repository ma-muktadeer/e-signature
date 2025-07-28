import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AngularSlickgridModule } from 'angular-slickgrid';
import { ActivityLogRoutingModule } from './activity-log-routing.module';
import { ActivityLogsComponent } from './activity-logs/activity-logs.component';
import { FormsModule } from '@angular/forms';
import { NgxLoadingModule } from 'ngx-loading';
import { NgxInputLoaderModule } from 'ngx-input-loader';


@NgModule({
  declarations: [ActivityLogsComponent],
  imports: [
    CommonModule,
    ActivityLogRoutingModule,
    AngularSlickgridModule.forRoot(),
    FormsModule,
    NgxLoadingModule,
    NgxInputLoaderModule
  ]
})
export class ActivityLogModule { }
