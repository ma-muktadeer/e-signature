import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { CommonSearchComponent } from './common-search/common-search.component';
import { DownloadInfoComponent } from './download-info/download-info.component';
import { InstitutionAddComponent } from './institution-add/institution-add.component';
import { RequestPopupComponent } from './request-popup/request-popup.component';
import { NgxInputLoaderModule } from 'ngx-input-loader';
import { NgxLoadingModule } from 'ngx-loading';
import { SharedModule } from '../softcafe/shared/shared.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@NgModule({
  declarations: [InstitutionAddComponent, RequestPopupComponent, CommonSearchComponent, DownloadInfoComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    BsDatepickerModule,
    TimepickerModule,
    NgxLoadingModule,
    NgxInputLoaderModule,
    SharedModule,
    NgMultiSelectDropDownModule
  ],
  exports:[
    CommonSearchComponent,
    DownloadInfoComponent,
  ]
})
export class ShardModuleModule { }
