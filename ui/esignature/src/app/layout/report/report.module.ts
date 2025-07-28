import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularSlickgridModule } from 'angular-slickgrid';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxInputLoaderModule } from 'ngx-input-loader';
import { NgxLoadingModule } from 'ngx-loading';
import { BankReportComponent } from './bank-report/bank-report.component';
import { DocReportComponent } from './doc-report/doc-report.component';
import { EmailComponent } from './email/email.component';
import { ExceptionReportComponent } from './exception-report/exception-report.component';
import { HrModuleReportComponent } from './hr-module-report/hr-module-report.component';
import { LoggedReportComponent } from './logged-report/logged-report.component';
import { NewsFeedOthersReportComponent } from './news-feed-others-report/news-feed-others-report.component';
import { PaReportComponent } from './pa-report/pa-report.component';
import { PasswordReportComponent } from './password-report/password-report.component';
import { PrintDownloadReportComponent } from './print-download-report/print-download-report.component';
import { ReportRoutingModule } from './report-routing.module';
import { SignatureHistoryReportComponent } from './signature-history-report/signature-history-report.component';
import { SignatureReportComponent } from './signature-report/signature-report.component';
import { SignatureSearchComponent } from './signature-search/signature-search.component';
import { SmsComponent } from './sms/sms.component';
import { UserAuditComponent } from './user-audit/user-audit.component';
import { UserReportComponent } from './user-report/user-report.component';
import { RequestReportComponent } from './request-report/request-report.component';


@NgModule({
  declarations: [SmsComponent, EmailComponent, LoggedReportComponent, UserReportComponent, PasswordReportComponent, SignatureReportComponent, NewsFeedOthersReportComponent, PrintDownloadReportComponent, HrModuleReportComponent, SignatureSearchComponent, PaReportComponent, BankReportComponent, SignatureHistoryReportComponent, DocReportComponent, ExceptionReportComponent, UserAuditComponent, RequestReportComponent],
  providers:[DatePipe],
  imports: [
    CommonModule,
    ReportRoutingModule,
    AngularSlickgridModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgxLoadingModule,
    NgxInputLoaderModule,
    NgMultiSelectDropDownModule
  ]
})
export class ReportModule { }
