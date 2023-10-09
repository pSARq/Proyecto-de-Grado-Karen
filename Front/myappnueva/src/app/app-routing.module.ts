import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { AdicionarComponent } from './components/adicionar/adicionar.component';
import { RouterModule, Routes } from '@angular/router';
import { MenuComponent } from './components/menu/menu.component';
import { LoginComponent } from './components/login/login.component';

import { NavegacionComponent } from './components/navegacion/navegacion.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashboardcitaComponent } from './components/dashboardcita/dashboardcita.component';
import { RegistroComponent } from './components/login/registro/registro.component';
import { RegistrocitasComponent } from './components/dashboardcita/registrocitas/registrocitas.component';
import AdminGuard from './guards/admin.guard';
import DirectivoGuard from './guards/directivo.guard';
import { EstudianteGuard } from './guards/estudiante.guard';
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
  { path: '', redirectTo: '/', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: DashboardComponent,
   // Aplica el guard de admin
  },
  {path: 'navegacion', component: NavegacionComponent},
  {
    path: 'registrocitas',
    component: RegistrocitasComponent,

  },
  {
    path: 'director',
    component: DirectorComponent,

  },

  { path: 'director/registrosolicitudes', component: RegistrosolictudesComponent },
  {
    path: 'dashboardcita',
    component: DashboardcitaComponent,

  },


  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },


  {
    path: 'adicionar',
    component: AdicionarComponent,
     // Aplica el guard de admin
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
