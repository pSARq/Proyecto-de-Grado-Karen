export class NuevoUsuarioDto {

  id?: number;
  nombre: string;
  correo: string;
  password: string;
  rol?: String;
  carrera: string;
  semestre: string;

  constructor(nombre?: string, correo?: string, password?: string, carrera?: string, semestre?: string) {
    this.nombre = nombre ? nombre : '';
    this.correo =  correo ? correo : '';
    this.password = password ? password : '';
    this.carrera = carrera ? carrera : '';
    this.semestre = semestre ? semestre : '';
  }

}

