import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ChangePasswordGuard } from './change-password/change-password.guard';
import { ProfileComponent } from './profile/profile.component';
import { SettingComponent } from './setting/setting.component';

const routes: Routes = [
  {
    path : '',
    component : ProfileComponent
  },
  {
    path : 'profile',
    component : ProfileComponent, 
  },
  {
    path : 'profile2',
    component : ProfileComponent, 
  },
  {
    path : 'change-password',
    component : ChangePasswordComponent, canActivate: [ChangePasswordGuard]

  }
  ,
  {
    path: 'setting',
    component: SettingComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
