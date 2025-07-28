import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularSlickgridModule } from 'angular-slickgrid';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgxInputLoaderModule } from 'ngx-input-loader';
import { NgxLoadingModule } from 'ngx-loading';
import { ImageViewModule } from 'src/app/image-view/image-view.module';
import { ShardModuleModule } from 'src/app/shard-module/shard-module.module';
import { SharedModule } from 'src/app/softcafe/shared/shared.module';
import { ESignatureListComponent } from './e-signature-list/e-signature-list.component';
import { ESignaturePopupComponent } from './e-signature-popup/e-signature-popup.component';
import { ESignatureRoutingModule } from './e-signature-routing.module';
import { DndDirective } from './e-signature-upload/dnd.directive';
import { ESignatureUploadComponent } from './e-signature-upload/e-signature-upload.component';
import { ESignatureViewComponent } from './e-signature-view/e-signature-view.component';
import { ESignatureGuard } from './e-signature.guard';
import { SignatureDownloadComponent } from './signature-download/signature-download.component';
import { SignatureHistoryComponent } from './signature-history/signature-history.component';


@NgModule({
  declarations: [
    ESignatureUploadComponent,
    ESignatureViewComponent,
    DndDirective,
    ESignatureListComponent,
    ESignaturePopupComponent,
    SignatureHistoryComponent,
    SignatureDownloadComponent,
  ],
  imports: [
    CommonModule,
    ESignatureRoutingModule,
    NgMultiSelectDropDownModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    ImageCropperModule,
    AngularSlickgridModule.forRoot(),

    HttpClientModule,

    NgbTypeaheadModule,

    NgxInputLoaderModule.forRoot(),

    TabsModule.forRoot(),
    NgbModule,
    // NgxExtendedPdfViewerModule,
    ImageViewModule,
    NgxLoadingModule, 
    ShardModuleModule,
    NgxInputLoaderModule,
    SharedModule


  ],
  providers: [BsModalService, ESignatureGuard]
})
export class ESignatureModule { }
