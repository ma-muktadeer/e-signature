import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { AngularSlickgridModule } from 'angular-slickgrid';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxLoadingModule } from 'ngx-loading';
import { ShardModuleModule } from 'src/app/shard-module/shard-module.module';
import { SharedModule } from 'src/app/softcafe/shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AddBicComponent } from './bic-code/add-bic/add-bic.component';
import { BicCodeComponent } from './bic-code/bic-code.component';
import { BranchComponent } from './branch/branch.component';
import { InstitutionListComponent } from './institution-list/institution-list.component';
import { ManageRoleGroupComponent } from './manage-role-group/manage-role-group.component';
import { ManageRoleComponent } from './manage-role/manage-role.component';
import { PermissionComponent } from './permission/permission.component';
import { RoleGroupComponent } from './role-group/role-group.component';
import { RoleComponent } from './role/role.component';
import { SecurityQuestionAnswerComponent } from './security-question-answer/security-question-answer.component';
import { SecurityQuestionComponent } from './security-question/security-question.component';
import { UserListComponent } from './user-list/user-list.component';
import { NgxInputLoaderModule } from 'ngx-input-loader';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    AngularSlickgridModule.forRoot(),
    DragDropModule,
    SharedModule,
    NgbModule,
    ModalModule.forRoot(),
    ShardModuleModule,
    NgxLoadingModule,
    NgxInputLoaderModule,
    NgMultiSelectDropDownModule
   
  ],
  declarations: [UserListComponent,
    ManageRoleComponent, BranchComponent,
    BicCodeComponent, AddBicComponent,
    RoleGroupComponent, PermissionComponent,
    RoleComponent, ManageRoleGroupComponent,
    SecurityQuestionComponent,
    SecurityQuestionAnswerComponent,
    InstitutionListComponent],
  entryComponents: [AddBicComponent],
  exports:[
    UserListComponent
  ]
})
export class AdminModule { }
