import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatosService } from 'src/app/services/datos.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registrosolictudes',
  templateUrl: './registrosolictudes.component.html',
  styleUrls: ['./registrosolictudes.component.css']
})
export class RegistrosolictudesComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSourceSolicitudes = new MatTableDataSource<usuario>([]); // Fuente de datos para solicitudes
  dataSourceTramites = new MatTableDataSource<usuario>([]); // Fuente de datos para trámites
  filtroId: string = ''; // Variable para almacenar el ID ingresado
  filtroTipoSolicitud: string = ''; // Variable para almacenar el Tipo de Solicitud ingresado
  solicitudesFiltradas: Solicitud[] = []; // Arreglo para almacenar las solicitudes filtradas
  filtroMotivo: string = ''; // Variable para almacenar el Motivo seleccionado
  tiposSolicitud: string[] = ["Cancelar Asignatura", "Adicionar Asignatura", "Agendar Cita"];
  filtroTipoSolicitudSeleccionado: string = ''; // Variable para almacenar la opción seleccionada
  dataSource = new MatTableDataSource<Solicitud>([]);
  // ...
  filtroBusqueda: string = ''; // Valor inicial como cadena vacía
  buscarPorID: boolean = false; // Valor inicial verdadero para Buscar por ID
  buscarPorTipo: boolean = false;
  // ...
  solicitudes: Solicitud[] = [];
  tramites: Tramite[] = [];
  datos: Dato[] = [];
  page: number = 0;
  consultasos: any

  constructor(private router: Router, private route: ActivatedRoute, private datos_: DatosService) { }

  currentDateTime = ""
  timer: any; // Variable para almacenar el temporizador

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  ngOnInit() {
    // Configura un temporizador para actualizar la hora cada segundo
    this.timer = setInterval(() => {
      this.currentDateTime = this.getFormattedDateTime();
    }, 1000);
    this.currentDateTime = this.getFormattedDateTime();
    // Realizar aquí las inicializaciones que no requieren de la vista (template)
    this.mostrarSolicitudes();
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

  ngAfterViewInit() {
    this.mostrarSolicitudes();
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

  mostrarSolicitudes() {
    this.datos_.mostrarSolicitudes().subscribe(
      (solicitudes: Solicitud[]) => {
        this.buscarSolicitudes();
        // Manejar solicitudes
        console.log('Solicitudes del estudiante:', solicitudes);
        this.solicitudes = solicitudes; // Asigna las solicitudes al arreglo del componente
        this.dataSourceSolicitudes = new MatTableDataSource<usuario>(solicitudes.map((solicitud, index) => ({
          position: index + 1,
          name: solicitud.nombre,
          weight: parseFloat(solicitud.semestre),
          symbol: solicitud.motivo
        })));
        this.dataSourceSolicitudes.paginator = this.paginator; // Configura el paginador para la nueva fuente de datos
      },
      (error) => {
        // Manejar error de solicitudes
        console.error('Error al recuperar las solicitudes:', error);
        // Aquí puedes manejar el error, mostrar un mensaje al usuario, etc.
      }
    );

    this.datos_.tablaConsulta().subscribe(
      (tramites: Tramite[]) => {
        // Manejar trámites
        console.log('Solicitudes del estudiante:', tramites);
        this.tramites = tramites; // Asigna las solicitudes al arreglo del componente
        this.dataSourceTramites = new MatTableDataSource<usuario>(tramites.map((tramite, index) => ({
          position: index + 1,
          name: tramite.estado,
          weight: parseFloat(tramite.respuesta),
          symbol: tramite.consulta_id
        })));
        this.dataSourceTramites.paginator = this.paginator; // Configura el paginador para la nueva fuente de datos
      },
      (error) => {
        // Manejar error de trámites
        console.error('Error al recuperar las solicitudes:', error);
        // Aquí puedes manejar el error, mostrar un mensaje al usuario, etc.
      }
    );
  }

  responderSolicitud(id: string) {
    const solicitudEnEdicion = this.solicitudes.find((solicitud) => solicitud.id === id);

    if (!solicitudEnEdicion) {
      console.error('No se encontró la solicitud con el ID proporcionado.');
      return; // Manejar caso cuando no se encuentra la solicitud con el ID proporcionado
    }

    Swal.fire({
      title: 'Respuesta Solicitud',
      html: `
    <div>
      <label for="estado">Estado:</label>
      <select id="estado" class="swal2-input">
        <option value="En tramite" ${solicitudEnEdicion.estado === 'En tramite' ? 'selected' : ''}>En Trámite</option>
        <option value="Aprobado" ${solicitudEnEdicion.estado === 'Aprobado' ? 'selected' : ''}>Aprobado</option>
        <option value="Rechazado" ${solicitudEnEdicion.estado === 'Rechazado' ? 'selected' : ''}>Rechazado</option>
        <option value="Solucionado" ${solicitudEnEdicion.estado === 'Solucionado' ? 'selected' : ''}>Solucionado</option>
      </select>
      <br>
      <label for="respuesta">Respuesta:</label>
      <input type="text" id="respuesta" class="swal2-input">
    </div>
    `,
      showCancelButton: true,
      confirmButtonText: 'Guardar cambios',
      cancelButtonText: 'Cancelar',
      focusConfirm: false,
      preConfirm: () => {
        const estado = (document.getElementById('estado') as HTMLInputElement).value;
        const respuesta = (document.getElementById('respuesta') as HTMLInputElement).value;
        const fechaRespuesta = this.currentDateTime
        // Llamada al servicio para responder a la solicitud
        this.datos_.responderSolicitudes(id, { estado, respuesta, fechaRespuesta }).subscribe(
          () => {
            // Éxito al responder la solicitud
            Swal.fire({
              title: 'Solicitud Actualizada',
              icon: 'success',
              timer: 1500,
              timerProgressBar: true,
            });

            // Insertar en la tabla "consulta"
            const consultaData = {
              solicitudId: id,
              respuesta: respuesta,
              estado: estado,
              fechaRespuesta: fechaRespuesta
            };
          },
          (error) => {
            // Manejar el error en caso de ser necesario
            console.error('Error al responder a la solicitud:', error);
            Swal.fire({
              title: 'Error',
              text: 'Ocurrió un error al responder a la solicitud.',
              icon: 'error',
              timer: 1500,
              timerProgressBar: true,
            });
          }
        );
      },
    });
  }

  activeLink: string = 'inicio'; // Página activa por defecto (Inicio)

  showSection(section: string) {
    this.activeLink = section;
  }
}

export interface Solicitud {
  nombre: string;
  motivo: string;
  semestre: string;
  id: string;
  fecha: string;
  estado: string;
}


export interface Consulta {
  id: string;
  estado: '',
  respuesta: '',
  consulta_id: ''
}

export interface Tramite {
  id: string;
  estado: string,
  respuesta: string,
  consulta_id: '',
  fechaConsulta: string
}

export interface Dato {
  id: string;
  nombre: string;
  selected1: string;
}

export interface usuario {
  position: number;
  name: string;
  weight: number;
  symbol: string;
}
