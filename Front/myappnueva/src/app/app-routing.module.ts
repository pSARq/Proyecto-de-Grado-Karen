import { NgModule } from '@angular/core';
import { AdicionarComponent } from './components/adicionar/adicionar.component';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';

import { NavegacionComponent } from './components/navegacion/navegacion.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashboardcitaComponent } from './components/dashboardcita/dashboardcita.component';
import { RegistroComponent } from './components/login/registro/registro.component';
import { RegistrocitasComponent } from './components/dashboardcita/registrocitas/registrocitas.component';
import { DirectorComponent } from './components/director/director.component';
import { RegistrosolictudesComponent } from './components/director/registrosolictudes/registrosolictudes.component';

/**

const routes: Routes = [


  {path: '', redirectTo:'/app', pathMatch: 'full'},
  {path: 'login',component: LoginComponent},

  {path:'menu',component: MenuComponent},
  {path: 'adicionar/:id', component: AdicionarComponent},
  {path: 'navegacion', component: NavegacionComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'dashboardcita', component: DashboardcitaComponent},

  {path: 'registro', component: RegistroComponent},
  {path: 'registrocitas', component: RegistrocitasComponent},

  ];
*/

const routes: Routes = [
  {
    path: '',
    redirectTo: '/',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'navegacion',
    component: NavegacionComponent
  },
  {
    path: 'registrocitas',
    component: RegistrocitasComponent
  },
  {
    path: 'director',
    component: DirectorComponent
  },
  {
    path: 'director/registrosolicitudes',
    component: RegistrosolictudesComponent
  },
  {
    path: 'dashboardcita',
    component: DashboardcitaComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'registro',
    component: RegistroComponent
  },
  {
    path: 'adicionar',
    component: AdicionarComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
