import { Component, OnInit, ViewChild } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { FirestoreserviceService } from '../../services/servicefirestore/firestoreservice.service';
import { UserService } from '../../services/user.service';
import {AfterViewInit} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { DatosService } from 'src/app/services/datos.service';
import { HttpHeaders } from '@angular/common/http';
import { Result } from '../navegacion/navegacion.component';

@Component({
  selector: 'app-dashboardcita',
  templateUrl: './dashboardcita.component.html',
  styleUrls: ['./dashboardcita.component.css']
})
export class DashboardcitaComponent implements OnInit {

  solicitudes:Tramite[]=[]
  data: Result[] = [];
  constructor(private firestore: FirestoreserviceService, private user: UserService, private datos: DatosService){}

  idEstudiante: string = ''
  currentDateTime: string = this.getFormattedDateTime().toString();
  timer: any; // Variable para almacenar el temporizador

  ngOnInit(){
   this.formcita.id_estudiante=  this.datos.getIdEstudiante();

  // Configura un temporizador para actualizar la hora cada segundo
  this.timer = setInterval(() => {
    this.formcita.fecha0 = this.getFormattedDateTime();
  }, 1000);
  }
  ngAfterViewInit(){
    this.recuper();
  }

  recuper(){


    const idEstudiante = this.datos.getIdEstudiante();

    // Verifica que el idEstudiante no esté vacío o nulo
    if (idEstudiante) {
      this.datos.recuperarSolicitudesres(idEstudiante).subscribe(
        (solicitudes:any) => {
          // Aquí puedes manejar las solicitudes recuperadas

          this.solicitudes = solicitudes;

          // Asigna las solicitudes al arreglo del componente
        },
        (error) => {
          console.error('Error al recuperar las solicitudes:', error);
          // Aquí puedes manejar el error, mostrar un mensaje al usuario, etc.
        }
      );



    } else {
      console.error('Id de estudiante no encontrado.');
    }



  }
  users:any;
  fecha = new Date();


formcita = {
  nombre: '',
  motivo: '',
  fecha0: '',
  semestre: '',
  id_estudiante: '',
  estado: 'En Tramite',
  mensaje:''

};

getFormattedDateTime(): string {
  const fecha = new Date();
  const dia = fecha.getDate().toString().padStart(2, '0');
  const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
  const anio = fecha.getFullYear();
  let hora = fecha.getHours();
  const minutos = fecha.getMinutes().toString().padStart(2, '0');
  const segundos = fecha.getSeconds().toString().padStart(2, '0');

  let periodo = 'AM';

  // Convierte la hora al formato de 12 horas y determina si es AM o PM
  if (hora >= 12) {
    periodo = 'PM';
    hora = hora - 12;
  }

  // Asegúrate de que la hora no sea 0 en el formato de 12 horas
  if (hora === 0) {
    hora = 12;
  }

  return `${dia}/${mes}/${anio} ${hora}:${minutos}:${segundos} ${periodo}`;


}
Regist() {
  const token = this.datos.getToken();

  if (!token) {
    console.error('Token no encontrado. El usuario no está autenticado.');
    return;
  }

  // Aquí realizas la lógica que requiere autenticación y verificas el token.
  // Si el token está cerca de expirar o ya ha expirado, puedes llamar a la función refreshToken():
  this.datos.refreshToken().subscribe(
    () => {
      // Realiza la lógica protegida aquí después de refrescar el token.
      // Por ejemplo, puedes realizar una solicitud protegida con el nuevo token aquí.
      // Luego, llama a la función para insertar los datos de la solicitud.
      this.insertarSolicitud();

    },
    (error) => {
      console.error('Error al refrescar el token:', error);
    }
  );
}

insertarSolicitud() {
  // Llamada a la función del servicio DatosService para insertar los datos de la solicitud.
  this.datos.registrarSolicitud(this.formcita).subscribe(
    () => {
      // Se ejecutará cuando la inserción sea exitosa.
      alert('Solicitud registrada exitosamente');


    },
    (error) => {
      // Se ejecutará en caso de error durante la inserción.
      alert('Error al registrar la solicitud');
    }
  );
}



// Resto del código del componente

idprueba(){
console.log('id: -'+ this.idEstudiante)
}






  registrarDatos(): void {



    this.datos.altaUser(this.formcita).subscribe(
        response => {
          console.log('Datos registrados:', response);
          // Puedes mostrar un mensaje de éxito o redirigir a otra página
        },
        error => {
          console.error('Error al registrar los datos:', error);
          // Puedes mostrar un mensaje de error o manejarlo de otra manera
        }
      );

  }








mostrarDatos(){
  this.firestore.mostrarRegistro().subscribe((data:any) =>{
  this.users = data.map((e:any)=>{
    return {
      id: e.payload.doc.id,
      nombre: e.payload.doc.data()['nombre']

    };

  })


  })

  }



  ObtenerUserlogout(){
    this.user.getUserLogged().subscribe(res =>{


      alert(res?.email)}

      )



  }


  activeLink: string = 'inicio'; // Página activa por defecto (Inicio)

  showSection(section: string) {
    this.activeLink = section;
  }
}


export interface Tramite {
  id: string;
  estado:string ,
  respuesta:string ,
   consulta_id:'',

  }
