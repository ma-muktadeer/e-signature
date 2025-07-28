import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxLoadingModule } from 'ngx-loading';
import { CompleteRegiRoutingModule } from './complete-regi-routing.module';
import { CompleteRegiComponent } from './complete-regi.component';
import { SharedModule } from '../softcafe/shared/shared.module';



@NgModule({
  declarations: [CompleteRegiComponent],
  imports: [
    CommonModule,
    CompleteRegiRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgMultiSelectDropDownModule,
    SharedModule,
    // BrowserAnimationsModule
    
    NgxLoadingModule, 
  ]
})
export class CompleteRegiModule { }
