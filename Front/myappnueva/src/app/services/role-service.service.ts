import { Injectable } from '@angular/core';
import { DatosService } from './datos.service';

@Injectable({
  providedIn: 'root'
})
export class RoleServiceService {

  constructor(private datos_: DatosService) { }

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
