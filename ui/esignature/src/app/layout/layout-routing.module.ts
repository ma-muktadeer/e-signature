import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactComponent } from './contact/contact.component';
import { GeneralNoticeComponent } from './general-notice/general-notice.component';
import { LayoutComponent } from './layout.component';
import { LayoutGuard } from './layout.guard';
import { LegalDisclamerComponent } from './legal-disclamer/legal-disclamer.component';
import { RoleUsersComponent } from './role-users/role-users.component';
import { UserDetailsComponent } from './user-details/user-details.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        canActivate: [LayoutGuard],
        children: [
            { 
                path: '', redirectTo: 'dashboard', pathMatch: 'prefix', 
            },
            { 
                path: 'news-feeds', 
                component: GeneralNoticeComponent, pathMatch: 'prefix' 
            },
            { 
                path: 'legal-disclaimer', 
                component: LegalDisclamerComponent, pathMatch: 'full' 
            },
            { 
                path: 'dashboard', 
                loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule), 
            },
            { 
                path: 'hr', 
                loadChildren: () => import('./hr-module/hr-module.module').then(m => m.HrModuleModule),
            },
            { 
                path: 'admin', 
                loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
            },
            { 
                path: 'user', 
                loadChildren: () => import('./user/user.module').then(m => m.UserModule),
            },
            /* { 
                path: 'chat', 
                loadChildren: () => import('./chat/chat.module').then(m => m.ChatModule),
            }, */
            { 
                path: 'attendance', 
                loadChildren: () => import('./attendance/attendance.module').then(m => m.AttendanceModule),
            },
            { 
                path: 'setting', 
                loadChildren: () => import('./setting/setting.module').then(m => m.SettingModule),
            },
            { 
                path: 'report', 
                loadChildren: () => import('./report/report.module').then(m => m.ReportModule),
            },
            
            { 
                path: 'blank-page', 
                loadChildren: () => import('./blank-page/blank-page.module').then(m => m.BlankPageModule),
            },
            { 
                path: 'log', 
                loadChildren: () => import('./process-log/process-log.module').then(m => m.ProcessLogModule),
            },
            { 
                path: 'signature', 
                loadChildren: () => import('./e-signature/e-signature.module').then(m => m.ESignatureModule),
            },
            { 
                path: 'request', 
                loadChildren: () => import('./request/request.module').then(m => m.RequestModule),
            },
            { 
                path: 'activity-log', 
                loadChildren: () => import('./activity-log/activity-log.module').then(m => m.ActivityLogModule),
            },
            { 
                path: 'report', 
                loadChildren: () => import('./report/report.module').then(m => m.ReportModule),
            },
            { 
                path: 'role/users', 
                component:RoleUsersComponent, pathMatch: 'full',
            },
            { 
                path: 'contact', 
                component: ContactComponent, pathMatch: 'full' 
            },
            { 
                path: 'user-details',
                component: UserDetailsComponent, pathMatch: 'full' 
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule {}
