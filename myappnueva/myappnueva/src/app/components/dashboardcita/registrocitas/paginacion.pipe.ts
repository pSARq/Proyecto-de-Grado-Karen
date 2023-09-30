import { Pipe, PipeTransform } from '@angular/core';
import { Solicitud, usuario } from './registrocitas.component';

@Pipe({
  name: 'paginacion'
})
export class PaginacionPipe implements PipeTransform {



  transform(value: Solicitud[], page:number=0):Solicitud[] {
    return value.slice(page,page+5);
  }

}
