import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxInputLoaderModule } from 'ngx-input-loader';
import { NgxLoadingModule } from 'ngx-loading';
import { ShardModuleModule } from 'src/app/shard-module/shard-module.module';
import { SharedModule } from '../../softcafe/shared/shared.module';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ProfileComponent } from './profile/profile.component';
import { SettingComponent } from './setting/setting.component';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule, 
    ReactiveFormsModule,
    SharedModule,
    NgMultiSelectDropDownModule,
    ShardModuleModule,
    NgxInputLoaderModule,
    NgxLoadingModule,
    SharedModule
    
  ],
  declarations: [ProfileComponent, ChangePasswordComponent, SettingComponent]
})
export class UserModule { }
