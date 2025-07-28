import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../softcafe/shared/shared.module';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';

@NgModule({
    imports: [CommonModule, LoginRoutingModule, 
        FormsModule, ReactiveFormsModule, SharedModule
    ],
    declarations: [LoginComponent]
})
export class LoginModule {}
