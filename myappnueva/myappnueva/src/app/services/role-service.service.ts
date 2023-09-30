import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from './user.service';
import { DatosService } from './datos.service';

@Injectable({
  providedIn: 'root'
})
export class RoleServiceService {

  constructor(private afAuth: AngularFireAuth,  private user: UserService, private datos_:DatosService) {
  }

  isAdmin(): boolean {
    const userRole = this.datos_.getRole();
    return userRole === 'admin';
  }

  isEstudiante(): boolean {
    const userRole = this.datos_.getRole();
    return userRole === 'estudiante';
  }

  isDirectivo(): boolean {
    const userRole = this.datos_.getRole();
    return userRole === 'Directivo';
  }
}
