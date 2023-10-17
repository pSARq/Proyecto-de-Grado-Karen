import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import { DatosService } from 'src/app/services/datos.service';

@Component({
  selector: 'app-director',
  templateUrl: './director.component.html',
  styleUrls: ['./director.component.css']
})
export class DirectorComponent implements OnInit {

  constructor(private breakpointObserver: BreakpointObserver,
    private user: UserService,
    private datos: DatosService
  ) { }

  estaLogueado: boolean = this.datos.consultaExitosa;

  data: Result[] = [];

  ngOnInit() {
    this.datos.userData$.subscribe(userData => {
      if (userData) {
        const result: Result = {
          id: userData.id,
          email: userData.email,
          nombre: userData.nombre,
        };
        this.data.push(result);
      }
    });
  }

  userLogged = this.user.getUserLogged();

  opened = false;

  isUserLoggedIn = this.datos.isUserLoggedIn()

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  logOut() { }


  prueba() {
    alert(this.isUserLoggedIn);
  }

}

export interface Result { id: string, email: string, nombre: string }



