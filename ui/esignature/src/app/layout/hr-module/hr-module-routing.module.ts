import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignatoryComponent } from './signatory/signatory.component';
import { SignatoryGuard } from './signatory/signatory.guard';
import { SampleDocComponent } from './sample-doc/sample-doc.component';

const routes: Routes = [
  {
    path: 'signatory',
    component: SignatoryComponent,
    canActivate: [SignatoryGuard]
  },
  {
    path: 'sample-doc',
    component: SampleDocComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HrModuleRoutingModule { }
