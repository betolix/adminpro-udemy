import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { Graficas1Component } from './pages/graficas1/graficas1.component';
import { ProgressComponent } from './pages/progress/progress.component';
import { NopagefoundComponent } from './shared/nopagefound/nopagefound.component';

const appRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: LoginComponent }, // FALTA GENERAR EL COMPONENTE
    { path: 'progress', component: ProgressComponent },
    { path: 'grafiscas1', component: Graficas1Component },
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: '**', component: NopagefoundComponent }
];

export const APP_ROUTES = RouterModule.forRoot( appRoutes, {useHash: true } );

// LUEGO DEBE IMPORTARSE EN EL app.module.ts
// ESTE ARCHIVO HA SIDO REEMPLAZADO POR EL app-routing.module.ts
