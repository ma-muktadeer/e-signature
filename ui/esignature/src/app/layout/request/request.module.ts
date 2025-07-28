import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularSlickgridModule } from 'angular-slickgrid';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxLoadingModule } from 'ngx-loading';
import { ExternalRequestComponent } from './external-request/external-request.component';
import { RequestRoutingModule } from './request-routing.module';


@NgModule({
  declarations: [ExternalRequestComponent],
  imports: [
    CommonModule,
    RequestRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularSlickgridModule.forRoot(),
    ModalModule.forRoot(),
    NgbModule,
    NgxLoadingModule, 

  ]
})
export class RequestModule { }
