import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import {AngularFireModule } from "@angular/fire/compat";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MenuComponent } from './components/menu/menu.component';
import { AdicionarComponent } from './components/adicionar/adicionar.component';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NavegacionComponent } from './components/navegacion/navegacion.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import {MatGridListModule} from '@angular/material/grid-list'

import {MatMenuModule} from '@angular/material/menu';
import { DashboardcitaComponent } from './components/dashboardcita/dashboardcita.component';
import { RegistroComponent } from './components/login/registro/registro.component';
import {MatTableModule} from '@angular/material/table';
import { RegistrocitasComponent } from './components/dashboardcita/registrocitas/registrocitas.component';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { PaginacionPipe } from './components/dashboardcita/registrocitas/paginacion.pipe';
import { SolicitudesComponent } from './components/solicitudes/solicitudes.component';
import { DirectorComponent } from './components/director/director.component';
import { RegistrosolictudesComponent } from './components/director/registrosolictudes/registrosolictudes.component';
import { FullCalendarModule } from '@fullcalendar/angular';
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    MenuComponent,
    AdicionarComponent,
    LoginComponent,
    NavegacionComponent,
    DashboardComponent,
    DashboardcitaComponent,
    RegistroComponent,
    RegistrocitasComponent,
    PaginacionPipe,
    SolicitudesComponent,
    DirectorComponent,
    RegistrosolictudesComponent,

  ],
  imports: [
    FormsModule,
    BrowserModule,
    MatCardModule,
    MatInputModule,
MatButtonModule,
RouterModule,
AppRoutingModule,
AngularFireModule.initializeApp(environment.firebase),
BrowserAnimationsModule,
LayoutModule,
MatToolbarModule,
MatSidenavModule,
MatIconModule,
MatListModule,
MatGridListModule,
MatMenuModule,
AngularFirestoreModule,
AngularFireStorageModule,
AngularFireDatabaseModule,
MatTableModule,
FullCalendarModule,
MatSelectModule,
MatDatepickerModule,

    MatNativeDateModule,
    HttpClientModule,
    
    JwtModule.forRoot({
      config: {
        tokenGetter,
        allowedDomains: ['192.168.0.11'], // Aquí debes poner el dominio o la URL de tu servidor backend
        disallowedRoutes: ['http://192.168.0.11/api/login'] // Aquí debes poner la URL de tu ruta de login del backend
      }
    })
  // ...otros metadatos...

  ],
  providers: [],
  bootstrap: [AppComponent]

})
export class AppModule { }
export function tokenGetter() {
  return localStorage.getItem('token');
}
