import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { PlatformModule } from '@angular/cdk/platform';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularSlickgridModule } from 'angular-slickgrid';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SharedModule } from 'src/app/softcafe/shared/shared.module';
import { AgreementSetupComponent } from './agreement-setup/agreement-setup.component';
import { AppConfigComponent } from './app-config/app-config.component';
import { ApplicationSetupComponent } from './application-setup/application-setup.component';
import { CommonFileViewGridComponent } from './common-file-view-grid/common-file-view-grid.component';
import { ContactInformationComponent } from './contact-information/contact-information.component';
import { CustMailSettingComponent } from './cust-mail-setting/cust-mail-setting.component';
import { DepartmentComponent } from './department/department.component';
import { ExcpHandelComponent } from './excp-handel/excp-handel.component';
import { LegalSetupComponent } from './legal-setup/legal-setup.component';
import { MailTmpPopComponent } from './mail-tmp-pop/mail-tmp-pop.component';
import { MailTmpComponent } from './mail-tmp/mail-tmp.component';
import { PopUpComponent } from './pop-up/pop-up.component';
import { SettingRoutingModule } from './setting-routing.module';
import { SigViewSetupComponent } from './sig-view-setup/sig-view-setup.component';
import { TreeTextComponent } from './tree-text/tree-text.component';
import { CommonViewComponent } from './common-view/common-view.component';
import { NgxLoadingModule } from 'ngx-loading';

@NgModule({
  imports: [
    CommonModule,
    SettingRoutingModule,
    ReactiveFormsModule,
    AngularSlickgridModule.forRoot(),
    // NgxExtendedPdfViewerModule,
    PlatformModule,
    FormsModule,
    HttpClientModule,
    AngularEditorModule,
    SharedModule,
    NgMultiSelectDropDownModule,
    NgbModule,
    DragDropModule,
    SharedModule,
    NgxLoadingModule
  ],
  declarations: [
    CustMailSettingComponent,
    ExcpHandelComponent,
    MailTmpComponent,
    ApplicationSetupComponent,
    DepartmentComponent,
    TreeTextComponent,
    PopUpComponent,
    MailTmpPopComponent,
    AgreementSetupComponent,
    SigViewSetupComponent,
    LegalSetupComponent,
    CommonFileViewGridComponent,
    AppConfigComponent,
    ContactInformationComponent,
    CommonViewComponent,
    ]
})
export class SettingModule { }
