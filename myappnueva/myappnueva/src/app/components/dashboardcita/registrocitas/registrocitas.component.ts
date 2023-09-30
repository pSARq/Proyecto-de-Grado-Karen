import { Component, ViewChild } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { FirestoreserviceService } from '../../../services/servicefirestore/firestoreservice.service';
import { UserService } from '../../../services/user.service';
import {AfterViewInit} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatosService } from 'src/app/services/datos.service';
import { User, getAuth } from '@angular/fire/auth';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

import Swal from 'sweetalert2';
import { DashboardcitaComponent } from '../dashboardcita.component';
@Component({
  selector: 'app-registrocitas',
  templateUrl: './registrocitas.component.html',
  styleUrls: ['./registrocitas.component.css']
})
export class RegistrocitasComponent implements AfterViewInit{

  searchById: boolean = true;
searchByType: boolean = false;

  solicitudes: Solicitud[] = [];

  filtroId: string = ''; // Variable para almacenar el ID ingresado
  filtroTipoSolicitud: string = ''; // Variable para almacenar el Tipo de Solicitud ingresado
  solicitudesFiltradas: Solicitud[] = []; // Arreglo para almacenar las solicitudes filtradas
  filtroMotivo: string = ''; // Variable para almacenar el Motivo seleccionado
  tiposSolicitud: string[] = ["Cancelar Asignatura", "Adicionar Asignatura", "Agendar Cita"];
  filtroTipoSolicitudSeleccionado: string = ''; // Variable para almacenar la opción seleccionada
  currentDateTime: string = this.getFormattedDateTime().toString();
  timer: any; // Variable para almacenar el temporizador

  // ...
  filtroBusqueda: string = ''; // Valor inicial como cadena vacía
  buscarPorID: boolean = false; // Valor inicial verdadero para Buscar por ID
  buscarPorTipo: boolean = false;

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource<Solicitud>([]);
    userLogged = this.user.getUserLogged();

consultas: Consulta[] = [];
consul:any
  datos: Dato[] = [];
  filterCriteria: string="";
  searchTerm: any;
  selectedDate: Date | any = null; // Propiedad para almacenar la fecha seleccionada

  constructor(private firestore: FirestoreserviceService, private user: UserService, private router: Router, private route: ActivatedRoute, private datos_: DatosService, private dashboardcita: DashboardcitaComponent) {}



  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  buscarPorFecha(): void {
    if (this.selectedDate) {
      // Convierte la fecha seleccionada a una cadena en el formato "dd/mm/yyyy"
      const selectedDateString = this.selectedDate.toLocaleDateString().toString();

      // Filtra las solicitudes por la fecha seleccionada
      this.solicitudesFiltradas = this.solicitudes.filter((solicitud: Solicitud) => {
        // Convierte la fecha en la solicitud a una cadena en el mismo formato "dd/mm/yyyy"
        const solicitudDateString = new Date(solicitud.fecha).toLocaleDateString().toString();

        // Compara las cadenas de fecha
        return solicitudDateString === selectedDateString;
      });

      // Actualiza la fuente de datos de la tabla
      this.dataSource = new MatTableDataSource<Solicitud>(this.solicitudesFiltradas);
      this.dataSource.paginator = this.paginator;
    } else {
      // Si no hay fecha seleccionada, muestra todas las solicitudes
      this.dataSource = new MatTableDataSource<Solicitud>(this.solicitudes);
      this.dataSource.paginator = this.paginator;
    }
  }

  ngOnInit(){


   // Configura un temporizador para actualizar la hora cada segundo
   this.timer = setInterval(() => {
    this.currentDateTime = this.getFormattedDateTime();
  }, 1000);
this.currentDateTime = this.getFormattedDateTime();

   }

  ngAfterViewInit() {

    const idEstudiante = this.datos_.getIdEstudiante();

    // Verifica que el idEstudiante no esté vacío o nulo
    if (idEstudiante) {
      this.datos_.recuperarSolicitudes(idEstudiante).subscribe(
        (solicitudes) => {
          // Aquí puedes manejar las solicitudes recuperadas

          this.solicitudes = solicitudes;
          this.buscarSolicitudes(); // Llama a la función para cargar las solicitudes

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
   buscarSolicitudes() {
    // Convierte el filtro de búsqueda a minúsculas (para la búsqueda insensible a mayúsculas/minúsculas)
    const filtroBusquedaLower = this.filtroBusqueda.toString().toLowerCase();

    // Filtra las solicitudes basadas en las opciones de búsqueda seleccionadas
    this.solicitudesFiltradas = this.solicitudes.filter((solicitud: any) => {
      const cumpleFiltroID = this.buscarPorID && solicitud.id.toString() === filtroBusquedaLower;
      let cumpleFiltroTipo = true; // Inicialmente, se establece como verdadero

      if (this.buscarPorTipo || this.filtroTipoSolicitudSeleccionado) {
        cumpleFiltroTipo = solicitud.motivo.toLowerCase().includes(filtroBusquedaLower) &&
                          solicitud.motivo.toLowerCase() === this.filtroTipoSolicitudSeleccionado.toLowerCase();
      }

      // Retorna verdadero si al menos uno de los filtros cumple
      return cumpleFiltroID || cumpleFiltroTipo;
    });

    // Actualiza la fuente de datos de la tabla
    this.dataSource = new MatTableDataSource<Solicitud>(this.solicitudesFiltradas);
    this.dataSource.paginator = this.paginator;
  }




  mostrarEstado(id:any, con:any){



    this.datos_.recuperarEstado(id, con).subscribe(
      (consul: any) => {
        // Aquí puedes manejar las solicitudes recuperadas
        console.log('Solicitudes del estudiante:', consul);
        this.solicitudes = consul;

        // Asigna las solicitudes al arreglo del componente
      },
      (error) => {
        console.error('Error al recuperar las solicitudes:', error);
        // Aquí puedes manejar el error, mostrar un mensaje al usuario, etc.
      }
    );

  }

page:number=0;
users:any;
selectedRow: any;
seleccionado:any;
solicitud=null
recibiendo:any;
users2: User[] | undefined;

selectRow(row: any) {
  this.selectedRow = row;

 for (let i = 0; i < this.solicitudes.length; i++) {

  if (this.solicitudes[i].id==row) {

    this.seleccionado= row;

  }

 }

this.recibiendo = row.id;

this.router.navigate(['/adicionar', this.recibiendo])

}


registro={
  email:'editando@gmail.com',
  nombre:'editando'
};


art={
 id:null,
  nombre:null,
 motivo:null,
 fecha:'',
 semestre:null,
 mensaje:null
}


mostrarDatos(){
this.firestore.mostrarRegistrocitas().subscribe((data:any) =>{
this.users = data.map((e:any)=>{
  return {
    id: e.payload.doc.id,
    nombre: e.payload.doc.data()['nombre'],
    motivo: e.payload.doc.data()['motivo'],
    semestre: e.payload.doc.data()['semestre'],
    director: e.payload.doc.data()['director'],
    fecha: e.payload.doc.data()['fecha0'],
  };

})

this.solicitudes=data.map((e:any)=>{
  return {
    id: e.payload.doc.id,
    nombre: e.payload.doc.data()['nombre'],
    motivo: e.payload.doc.data()['motivo'],
    semestre: e.payload.doc.data()['semestre'],
    director: e.payload.doc.data()['director'],
    fecha: e.payload.doc.data()['fecha0'],
  };

})
console.log(this.solicitudes)

})

}
editarSolicitud(id: any) {
  const solicitudEnEdicion = this.solicitudes.find((solicitud) => solicitud.id === id);

  if (!solicitudEnEdicion) {
    console.error('No se encontró la solicitud con el ID proporcionado.');
    return; // Manejar caso cuando no se encuentra la solicitud con el ID proporcionado
  }

  // Comprobar si el estado de la solicitud es "En tramite" antes de permitir la edición
  if (solicitudEnEdicion.estado !== 'En tramite') {
    Swal.fire({ html:      ` <label>No se puede editar una solicitud que no está "En tramite".</label> `});
    return; // Manejar caso cuando el estado no es "En tramite"
  }

  Swal.fire({
    title: 'Editar solicitud',
    html: `
      <div style="height: 400px;">
        <label for="nombre">Nombre:</label>
        <input type="text" id="nombre" class="swal2-input" value="${solicitudEnEdicion.nombre}">

        <label for="motivo">Motivo:</label>
        <input type="text" id="motivo" class="swal2-input" value="${solicitudEnEdicion.motivo}">

        <label for="semestre">Semestre:</label>
        <input type="text" id="semestre" class="swal2-input" value="${solicitudEnEdicion.semestre}">

        <label for="mensaje">Mensaje:</label>
        <input type="text" id="mensaje" class="swal2-input" value="${solicitudEnEdicion.mensaje}">
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: 'Guardar cambios',
    cancelButtonText: 'Cancelar',
    width:1200,

    focusConfirm: false,

    preConfirm: () => {
      const nombre = (document.getElementById('nombre') as HTMLInputElement).value;
      const motivo = (document.getElementById('motivo') as HTMLInputElement).value;
      const semestre = (document.getElementById('semestre') as HTMLInputElement).value;
      const mensaje = (document.getElementById('mensaje') as HTMLInputElement).value;
      const fechaRespuesta = this.currentDateTime

      const nuevaSolicitud = {
        nombre: nombre,
        motivo: motivo,
        semestre: semestre,
        mensaje: mensaje,
        fecha: fechaRespuesta
      };

      // Obtener el token de autenticación (puedes obtenerlo de tu sistema de autenticación)
      const token = 'tu_token_de_autenticacion';

      // Llamada al servicio para actualizar la solicitud
      this.datos_.editarSolicitud(id, nuevaSolicitud, token).subscribe(
        () => {
          // Éxito al editar la solicitud
          Swal.fire({
            title: 'Solicitud Actualizada',
            text: 'La solicitud se ha actualizado correctamente.',
            icon: 'success',
            timer: 1500,
            timerProgressBar: true,
          });

          // Actualizar la lista local de solicitudes con la solicitud editada
          const index = this.solicitudes.findIndex((solicitud) => solicitud.id === id);
          if (index !== -1) {
            this.solicitudes[index] = { ...solicitudEnEdicion, ...nuevaSolicitud };
          }
        },
        (error) => {
          // Manejar el error en caso de ser necesario
          console.error('Error al editar la solicitud:', error);
          Swal.fire({
            title: 'Error',
            text: 'Ocurrió un error al editar la solicitud.',
            icon: 'error',
            timer: 1500,
            timerProgressBar: true,
          });
        }
      );
    },
  });
}



// Método para eliminar una solicitud
eliminarRegistro(idSolicitud: any) {
  // Muestra un modal de SweetAlert 2 para confirmar la eliminación
  Swal.fire({
    // Resto del código...
  });
}





editarRegistro(id:any){

}



sigPagina(){
this.page+=5;

}
antePagina(){


  if (this.page> 0) {
    this.page-=5;
  }

}


}

export interface Solicitud {
  nombre: string;
  motivo: string;
  semestre: string;
  id: string;
  fecha: string;
  estado:string;
mensaje:string;
}

export interface Consulta {
id:'',
estado:'',
respuesta:''
}

export interface Dato {
  id:'',
  nombre:'',
  selected1: ''

}

export interface usuario  {
  name: string;
  position: number;
  weight: number;
  symbol: string;

};

const ELEMENT_DATA: usuario[] = [{position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'}];


