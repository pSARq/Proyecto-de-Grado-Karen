import { Component } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-root',
  templateUrl: './adicionar.component.html',
  styleUrls: ['./adicionar.component.css']
})
export class AdicionarComponent {
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: esLocale,
    events: [
      { title: 'Reunión', start: new Date() }
    ]
  };

  newEvent: any = {}; // Objeto para mantener los datos del nuevo evento
  isCreatingEvent = false; // Bandera para mostrar/ocultar el formulario de creación de eventos

  constructor() {}
  handleDateClick(info: DateClickArg) {
    // Abre el formulario de creación de eventos y establece la fecha seleccionada
    this.isCreatingEvent = true;
    this.newEvent = {
      title: '',
      start: info.dateStr
    };
  
    // Muestra un modal SweetAlert
    Swal.fire({
      title: 'Crear nuevo evento',
      html: `
        <input type="text" id="swal-input-title" class="swal2-input" placeholder="Título del evento">
      `,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      focusConfirm: false,
      preConfirm: () => {
        const title = (document.getElementById('swal-input-title') as HTMLInputElement).value;
        this.newEvent.title = title;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.createEvent();
      }
    });
  }
  
  createEvent() {
    // Agrega el nuevo evento a la lista de eventos y cierra el formulario
    this.calendarOptions.events = Array.isArray(this.calendarOptions.events) ? this.calendarOptions.events : [];
    this.calendarOptions.events = [
      ...this.calendarOptions.events,
      this.newEvent
    ];
    this.isCreatingEvent = false;
  }
  
  
}
