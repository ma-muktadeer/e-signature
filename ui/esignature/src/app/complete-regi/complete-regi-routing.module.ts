import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompleteRegiComponent } from './complete-regi.component';
import { CompleteRegiGuard } from './complete-regi.guard';

const routes: Routes = [
  {
    path: '', component: CompleteRegiComponent, canActivate: [CompleteRegiGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompleteRegiRoutingModule { }
