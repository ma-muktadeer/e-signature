import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicViewComponent } from './public-view/public-view.component';

const routes: Routes = [
  {path: '', component: PublicViewComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicViewRoutingModule { }
