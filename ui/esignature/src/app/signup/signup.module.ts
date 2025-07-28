import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SignupRoutingModule } from './signup-routing.module';
import { SignupComponent } from './signup.component';
//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
@NgModule({
  imports: [
    CommonModule,
    SignupRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgMultiSelectDropDownModule,
    //BrowserAnimationsModule
  ],
  declarations: [SignupComponent]
})
export class SignupModule { }
