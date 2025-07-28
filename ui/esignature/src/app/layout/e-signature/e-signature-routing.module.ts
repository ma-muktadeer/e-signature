import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ESignatureListComponent } from './e-signature-list/e-signature-list.component';
import { ESignatureUploadComponent } from './e-signature-upload/e-signature-upload.component';
import { ESignatureViewComponent } from './e-signature-view/e-signature-view.component';
import { ESignatureGuard } from './e-signature.guard';
import { SignatureDownloadComponent } from './signature-download/signature-download.component';
import { SignatureHistoryComponent } from './signature-history/signature-history.component';

const routes: Routes = [
  { path: 'upload', component: ESignatureUploadComponent, pathMatch: 'full', canActivate: [ESignatureGuard] },
  { path: 'internal/signature-view', component: ESignatureViewComponent, pathMatch: 'full', canActivate: [ESignatureGuard] },
  { path: 'external/signature-view', component: ESignatureViewComponent, pathMatch: 'full', canActivate: [ESignatureGuard] },
  { path: 'signature-list', component: ESignatureListComponent, pathMatch: 'full', canActivate: [ESignatureGuard] },
  { path: 'signature-log', component: ESignatureListComponent, pathMatch: 'full' },
  { path: 'signature-history', component: SignatureHistoryComponent, pathMatch: 'full' },
  { path: 'download', component: SignatureDownloadComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ESignatureRoutingModule { }
