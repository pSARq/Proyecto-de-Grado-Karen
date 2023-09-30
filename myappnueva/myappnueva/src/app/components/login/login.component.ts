import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import {Router, ActivatedRoute} from '@angular/router'
import { DatosService } from 'src/app/services/datos.service';
import { RoleServiceService } from 'src/app/services/role-service.service';
import AdminGuard from 'src/app/guards/admin.guard';
import { EstudianteGuard } from 'src/app/guards/estudiante.guard';
import DirectivoGuard from 'src/app/guards/directivo.guard';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

constructor(private user: UserService, private router: Router, private route: ActivatedRoute, private datos: DatosService, private roles:RoleServiceService, private http: HttpClient){}
characters: any[] = [];

ngOnInit(): void {

    this.ObtenerUserlogout();


}

usuario = {
email: '',
password:'',
id:''
}

Filtro=""
Filtro2=""
Email=""
Password=""

login() {
  this.datos.login(this.Filtro, this.Filtro2)
  .subscribe(
    (response) => {
      // El inicio de sesión fue exitoso, guarda el token y el rol del usuario

      this.datos.setTokenAndRole(response.token, response.rol );
      console.log("hola soy ROLLLLLLLLLL", response.nombre,response.rol,response.email)
      // Redirige al usuario a la página correspondiente según su rol
      if (response.rol === 'admin') {
        // Redirige a la página de administrador
        // Ejemplo: this.router.navigate(['/admin']);
      } else if (response.rol === 'estudiante') {

        const queryParams = { id:response.id, email: response.email, nombre: response.nombre };
        this.datos.setUserData(queryParams);
        // Navegar a "navegacion"

        this.router.navigate(['/dashboard']);

        console.log("YEaaaaaaa mea")
      } else if (response.rol === 'Directivo') {
        const queryParams = { email: response.email, nombre: response.nombre };
        this.datos.setUserData(queryParams);
        this.router.navigate(['/director']);

      }
    },
    (error) => {
      console.error('Error en el inicio de sesión:', error);
      // Aquí puedes mostrar un mensaje de error al usuario
    }
);

}


Registrarcorreo(){

      const {email,password} = this.usuario;

      this.user.register(email,password).then((res=>{alert("Se registro"+res)}));

}


loginGoogle(){

      const {email,password} = this.usuario;

      this.user.loginWithGoogle(email,password).then(res=>{alert("Ingreso correct"+res)});

}


ObtenerUserlogout(){
      this.user.getUserLogged().subscribe(res=>{alert(res?.email)})
}


logOut()
{

this.user.logOut();

}



async obtenerUid(){
const uid = await this.user.getUid();
alert("HOLa UID"+" "+uid)
}

navegar(){
this.router.navigate(['/adicionar'])
}

mostrarDatos(){
      {
          this.datos.recuperarTodosID(this.Filtro,this.Filtro2).subscribe(
            (result_: any) => {
              const solicitudes = result_;
              solicitudes.forEach((solicitud: any) => {
                const rolEstudiante = solicitud;

                const queryParams = { email: rolEstudiante.email, nombre: rolEstudiante.nombre };
                this.router.navigate(['navegacion'], { queryParams });

                this.router.navigate(["dashboard"])
                console.log('DATOS USUARIO:'+'  '+rolEstudiante.nombre,rolEstudiante.email, rolEstudiante.nombre_rol);
                // Aquí puedes mostrar el rol del estudiante como desees
              });
            },
            (error: any) => {


            console.log('Error al recuperar los datos:'+ error);
            }
          );
        }
}
}

export interface Enviar{email:string,nombre:string}
