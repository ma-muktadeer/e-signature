import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxLoadingModule } from 'ngx-loading';
import { ForgotPasswordRoutingModule } from './forgot-password-routing.module';
import { ForgotPasswordComponent } from './forgot-password.component';

@NgModule({
  imports: [
    CommonModule,
    ForgotPasswordRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgMultiSelectDropDownModule,
    NgxLoadingModule.forRoot({}),
  ],
  
  declarations: [ForgotPasswordComponent]
})
export class ForgotPasswordModule { }
