import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { DatosService } from 'src/app/services/datos.service';
import { NuevoUsuarioDto } from 'src/app/models/NuevoUsuarioDto';
import { Roles } from 'src/app/enums/roles.enum';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private user: UserService,
    private router: Router,
    private datos: DatosService
  ) { }

  ngOnInit(): void { }

  usuario: NuevoUsuarioDto = new NuevoUsuarioDto;

  login() {
    this.datos.login(this.usuario).subscribe(response => {
      const roles = localStorage.getItem('role')

      if (roles === Roles.ADMIN) {
        //TODO: FALTA PAGINA DE ADMIN ?????
      } else if (roles === Roles.USER) {
        // const queryParams = { id: response.id, email: response.email, nombre: response.nombre };
        // this.datos.setUserData(queryParams);
        // Navegar a "navegacion"
        this.router.navigate(['/dashboard']);
        console.log("YEaaaaaaa mea")
      } else if (roles === Roles.DIRECTOR) {
        // const queryParams = { email: response.email, nombre: response.nombre };
        // this.datos.setUserData(queryParams);
        this.router.navigate(['/director']);
      }
    },
      (error) => {
        console.error('Error en el inicio de sesión:', error);
        // Aquí puedes mostrar un mensaje de error al usuario
      }
    );
  }

  // Registrarcorreo() {
  //   const { correo, password } = this.usuario;
  //   this.user.register(correo, password)
  //     .then((res => {
  //       alert("Se registro" + res)
  //     }));
  // }

  loginGoogle() {
    const { correo, password } = this.usuario;
    this.user.loginWithGoogle(correo, password)
      .then(res => {
        alert("Ingreso correcto" + res)
      });
  }

  // ObtenerUserlogout() {
  //   this.user.getUserLogged()
  //     .subscribe(res => {
  //       alert(res?.email)
  //     })
  // }

  // logOut() {
  //   this.user.logOut();
  // }

  // async obtenerUid() {
  //   const uid = await this.user.getUid();
  //   alert("HOLa UID" + " " + uid)
  // }

  // navegar() {
  //   this.router.navigate(['/adicionar'])
  // }

}
//   mostrarDatos() {
//     {
//       this.datos.recuperarTodosID(this.Filtro, this.Filtro2).subscribe(
//         (result_: any) => {
//           const solicitudes = result_;
//           solicitudes.forEach((solicitud: any) => {
//             const rolEstudiante = solicitud;

//             const queryParams = { email: rolEstudiante.email, nombre: rolEstudiante.nombre };
//             this.router.navigate(['navegacion'], { queryParams });

//             this.router.navigate(["dashboard"])
//             console.log('DATOS USUARIO:' + '  ' + rolEstudiante.nombre, rolEstudiante.email, rolEstudiante.nombre_rol);
//             // Aquí puedes mostrar el rol del estudiante como desees
//           });
//         },
//         (error: any) => {
//           console.log('Error al recuperar los datos:' + error);
//         }
//       );
//     }
//   }
// }

// export interface Enviar { email: string, nombre: string }
