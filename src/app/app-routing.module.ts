import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagesComponent } from './pages/pages.component';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './login/register.component';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { Graficas1Component } from './pages/graficas1/graficas1.component';
import { ProgressComponent } from './pages/progress/progress.component';
import { NopagefoundComponent } from './shared/nopagefound/nopagefound.component';



const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'progress', component: ProgressComponent },
      { path: 'grafiscas1', component: Graficas1Component },
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }, // FALTA GENERAR EL COMPONENTE

  { path: '**', component: NopagefoundComponent }
];

@NgModule({
  //imports: [RouterModule.forRoot(routes)],
  // SE UTILIZO EL useHash: true
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
