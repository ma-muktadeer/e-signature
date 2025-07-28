import { Component, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExternalRequestComponent } from './external-request/external-request.component';


const routes: Routes = [
  {
    path: "external", component : ExternalRequestComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestRoutingModule { }
