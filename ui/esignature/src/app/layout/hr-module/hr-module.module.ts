import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularSlickgridModule } from 'angular-slickgrid';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxLoadingModule } from 'ngx-loading';
import { ShardModuleModule } from 'src/app/shard-module/shard-module.module';
import { SharedModule } from 'src/app/softcafe/shared/shared.module';
import { HrModuleRoutingModule } from './hr-module-routing.module';
import { SampleDocComponent } from './sample-doc/sample-doc.component';
import { SignatoryComponent } from './signatory/signatory.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@NgModule({
  declarations: [
    SignatoryComponent,
    SampleDocComponent
  ],
  imports: [
    CommonModule,
    HrModuleRoutingModule,
    
    AngularSlickgridModule.forRoot(),
    NgbModule,
    ModalModule.forRoot(),
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    NgxLoadingModule,
    // NgxExtendedPdfViewerModule,
    ShardModuleModule,
    NgMultiSelectDropDownModule
  ]
})
export class HrModuleModule { }
