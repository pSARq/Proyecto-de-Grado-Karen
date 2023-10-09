import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import { DatosService } from 'src/app/services/datos.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-navegacion',
  templateUrl: './navegacion.component.html',
  styleUrls: ['./navegacion.component.css']
})
export class NavegacionComponent implements OnInit{
  isEstudiante: boolean = false;
  isDirectivo: boolean = false;
  constructor(private breakpointObserver: BreakpointObserver,private user: UserService, private datos:DatosService, private route: ActivatedRoute,) {}
   userRole = this.datos.getRole();
  estaLogueado: boolean = this.datos.consultaExitosa;

  data: Result[] = [];

  ngOnInit() {


    if (this.userRole === 'estudiante') {
      this.isEstudiante = true;
    } else if (this.userRole === 'Directivo') {
      this.isDirectivo = true;
    }
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

  opened=false;

   isUserLoggedIn = this.datos.isUserLoggedIn()



  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );




  logOut(){

  }


  prueba(){
   alert(this.userRole);

  }





}
export interface Result{id:string,email:string,nombre:string}










// ... (otras funciones)
