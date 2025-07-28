import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgxLoadingModule } from 'ngx-loading';
import { StatModule } from '../../shared';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { DashboardGuard } from './dashboard.guard';
@NgModule({
    imports: [
        CommonModule,
        DashboardRoutingModule,
        StatModule,
        NgxLoadingModule
    ],
    declarations: [
        DashboardComponent
    ],
    providers: [DashboardGuard]
})
export class DashboardModule {}
