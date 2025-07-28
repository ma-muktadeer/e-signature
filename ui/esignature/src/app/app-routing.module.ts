import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./layout/layout.module').then(m => m.LayoutModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./signup/signup.module').then(m => m.SignupModule)
  },
  {
    path: 'complete-regi',
    loadChildren: () => import('./complete-regi/complete-regi.module').then(m => m.CompleteRegiModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule)
  },
  {
    path: 'user-unlock',
    loadChildren: () => import('./forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule)
  },
  
  {
    path: 'error',
    loadChildren: () => import('./server-error/server-error.module').then(m => m.ServerErrorModule)
  },
  {
    path: 'access-denied',
    loadChildren: () => import('./access-denied/access-denied.module').then(m => m.AccessDeniedModule)
  },

  {
    path: 'signature',
    loadChildren: () => import('./signature-agreement/signature-agreement-routing.module')
      .then(m => m.SignatureAgreementRoutingModule)
  },
  {
    path: 'public-view',
    loadChildren: () => import('./public-view/public-view.module').then(m => m.PublicViewModule),
  },
  {
    path: 'not-found',
    loadChildren: () => import('./not-found/not-found.module').then(m => m.NotFoundModule)
  },
  {
    path: '**',
    redirectTo: 'not-found'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy', onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
