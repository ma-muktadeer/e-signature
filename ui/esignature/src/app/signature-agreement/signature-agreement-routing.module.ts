import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignatureAgreementGuard } from './signature-agreement.guard';
import { SignatureAgreementComponent } from './signature-agreement/signature-agreement.component';

const routes: Routes = [
  {path:'agreement', component:SignatureAgreementComponent, canActivate:[SignatureAgreementGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  
})
export class SignatureAgreementRoutingModule { }
