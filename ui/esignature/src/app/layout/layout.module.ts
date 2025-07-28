import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxLoadingModule } from 'ngx-loading';
import { AdminModule } from './admin/admin.module';
import { FooterFabComponent } from './components/footer-fab/footer-fab.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ContactComponent } from './contact/contact.component';
import { GeneralNoticeComponent } from './general-notice/general-notice.component';
import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { LayoutGuard } from './layout.guard';
import { LegalDisclamerComponent } from './legal-disclamer/legal-disclamer.component';
import { RoleUsersComponent } from './role-users/role-users.component';
import { UserDetailsComponent } from './user-details/user-details.component';

@NgModule({
    imports: [
        CommonModule,
        LayoutRoutingModule,
        TranslateModule,
        NgbDropdownModule,
        ModalModule.forRoot(),
        // NgxExtendedPdfViewerModule,
        AdminModule,
        NgxLoadingModule
    ],
    declarations: [LayoutComponent, SidebarComponent, HeaderComponent, FooterComponent, FooterFabComponent, GeneralNoticeComponent, LegalDisclamerComponent, ContactComponent, RoleUsersComponent, UserDetailsComponent],
    providers: [LayoutGuard],
})
export class LayoutModule { }
