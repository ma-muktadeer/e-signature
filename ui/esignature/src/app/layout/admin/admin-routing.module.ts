import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BicCodeComponent } from './bic-code/bic-code.component';
import { BranchComponent } from './branch/branch.component';
import { InstitutionListComponent } from './institution-list/institution-list.component';
import { InstitutionGuard } from './institution-list/institution.guard';
import { ManageRoleGroupComponent } from './manage-role-group/manage-role-group.component';
import { ManageRoleComponent } from './manage-role/manage-role.component';
import { PermissionComponent } from './permission/permission.component';
import { RoleGroupComponent } from './role-group/role-group.component';
import { RoleComponent } from './role/role.component';
import { SecurityQuestionAnswerComponent } from './security-question-answer/security-question-answer.component';
import { SecurityQuestionComponent } from './security-question/security-question.component';
import { UserListComponent } from './user-list/user-list.component';

const routes: Routes = [
  {
    path: '', redirectTo: 'user-list', pathMatch: 'prefix'
  },
  {
    path: 'user-list',
    component: UserListComponent
  },
  {
    path: 'user-pend-list',
    component: UserListComponent
  },
  {
    path: 'manage-role',
    component: ManageRoleComponent
  },
  {
    path: 'manage-role-group',
    component: ManageRoleGroupComponent
  },
  {
    path: 'branch',
    component: BranchComponent
  },
  {
    path: 'bic',
    component: BicCodeComponent
  },
  {
    path: 'role-group',
    component: RoleGroupComponent
  },
  {
    path: 'role',
    component: RoleComponent
  },
  {
    path: 'permission',
    component: PermissionComponent
  },
  {
    path: 'institution',
    component: InstitutionListComponent, canActivate: [InstitutionGuard]
  },
  {
    path: 'security-question', component: SecurityQuestionComponent
  },
  {
    path: 'security-question-answer', component: SecurityQuestionAnswerComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }