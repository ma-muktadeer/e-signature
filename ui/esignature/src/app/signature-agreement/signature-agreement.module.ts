import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { SignatureAgreementRoutingModule } from './signature-agreement-routing.module';
import { SignatureAgreementGuard } from './signature-agreement.guard';
import { SignatureAgreementComponent } from './signature-agreement/signature-agreement.component';


@NgModule({
  declarations: [SignatureAgreementComponent],
  imports: [
    CommonModule,
    SignatureAgreementRoutingModule,
    FormsModule,
  ],
  providers: [SignatureAgreementGuard]
})
export class SignatureAgreementModule { }
