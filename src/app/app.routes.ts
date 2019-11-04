import { RouterModule, Routes  } from '@angular/router';

import { PagesComponent } from './pages/pages.component';  //   WHY KEEP IT?

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './login/register.component';
import { NopagefoundComponent } from './shared/nopagefound/nopagefound.component';
import { LoginGuardGuard } from './services/service.index';


const appRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent }, // FALTA GENERAR EL COMPONENTE
    { 
        path: '',
        component: PagesComponent,
        canActivate: [ LoginGuardGuard ],
        loadChildren: './pages/pages.module#PagesModule',
     },
    { path: '**', component: NopagefoundComponent }
];

export const APP_ROUTES = RouterModule.forRoot( appRoutes, {useHash: true } );

// LUEGO DEBE IMPORTARSE EN EL app.module.ts
// ESTE ARCHIVO HA SIDO REEMPLAZADO POR EL app-routing.module.ts
