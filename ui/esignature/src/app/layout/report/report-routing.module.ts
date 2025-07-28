import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
import { SignatureHistoryReportComponent } from './signature-history-report/signature-history-report.component';
import { SignatureReportComponent } from './signature-report/signature-report.component';
import { SignatureSearchComponent } from './signature-search/signature-search.component';
import { SmsComponent } from './sms/sms.component';
import { UserAuditComponent } from './user-audit/user-audit.component';
import { UserReportComponent } from './user-report/user-report.component';
import { RequestReportComponent } from './request-report/request-report.component';

const routes: Routes = [
  {
    path:"sms",
    component : SmsComponent
  },
  {
    path:"email",
    component : EmailComponent
  },
  {
    path:"user-report",
    component : UserReportComponent
  },
  {
    path:"logged-report",
    component : LoggedReportComponent
  },
  {
    path:"password-report",
    component : PasswordReportComponent
  },
  {
    path:"signature-report",
    component : SignatureReportComponent
  },
  {
    path:"signature-search",
    component : SignatureSearchComponent
  },
  {
    path:"news-feed-&-others",
    component : NewsFeedOthersReportComponent
  },
  {
    path:"print-&-download-report",
    component : PrintDownloadReportComponent
  },
  {
    path:"hr-module-report",
    component : HrModuleReportComponent
  },
  {
    path:"pa-report",
    component : PaReportComponent
  },
  {
    path:"bank-report",
    component : BankReportComponent
  },
  {
    path:"signature-history",
    component : SignatureHistoryReportComponent
  },
  {
    path:"doc-report",
    component : DocReportComponent
  },
  {
    path:"exception-report",
    component : ExceptionReportComponent
  },
  {
    path:"user/audit",
    component : UserAuditComponent
  },
  {
    path:"request-report",
    component : RequestReportComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
