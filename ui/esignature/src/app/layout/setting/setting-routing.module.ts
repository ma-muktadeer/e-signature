import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgreementSetupComponent } from './agreement-setup/agreement-setup.component';
import { AppConfigComponent } from './app-config/app-config.component';
import { ApplicationSetupComponent } from './application-setup/application-setup.component';
import { CustMailSettingComponent } from './cust-mail-setting/cust-mail-setting.component';
import { DepartmentComponent } from './department/department.component';
import { ExcpHandelComponent } from './excp-handel/excp-handel.component';
import { LegalSetupComponent } from './legal-setup/legal-setup.component';
import { MailTmpComponent } from './mail-tmp/mail-tmp.component';
import { SigViewSetupComponent } from './sig-view-setup/sig-view-setup.component';
import { TreeTextComponent } from './tree-text/tree-text.component';
import { ContactInformationComponent } from './contact-information/contact-information.component';


const routes: Routes = [
  {
    path: "custmail",
    component: CustMailSettingComponent,
  }, 
  {
    path: "exception",
    component: ExcpHandelComponent,
  }, 
  {
    path: "templet/mail",
    component: MailTmpComponent,
  },
  {
    path: "application/setup",
    component: ApplicationSetupComponent,
  },
  {
    path: "application/config",
    component: AppConfigComponent,
  },
  {
    path: "agreement/setup",
    component: AgreementSetupComponent,
  },
  {
    path: "signature/view/setup",
    component: SigViewSetupComponent,
  },
  {
    path: "department",
    component: DepartmentComponent,
  },
  {
    path: "free-text",
    component: TreeTextComponent,
  },
  {
    path: "disclaimer/setup",
    component: LegalSetupComponent,
  },
  {
    path: "contact-info",
    component: ContactInformationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingRoutingModule { }
