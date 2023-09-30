import { Component, OnInit } from '@angular/core';
import { DatosService } from 'src/app/services/datos.service';
import { FirestoreserviceService } from 'src/app/services/servicefirestore/firestoreservice.service';
import { UserService } from 'src/app/services/user.service';
import { EmailVerificationService } from 'src/app/services/email-verification.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
  providers: [EmailVerificationService]
})
export class RegistroComponent implements OnInit {
  selectUser = "";
  Filtro = ""
  usuario = {
    nombre: '',
    email: '',
    password: '',
    rol: null,
    carrera: null,
    semestre: null
  }

  constructor(private firestore: FirestoreserviceService, private user: UserService, private datos: DatosService, private emails: EmailVerificationService) { }

  ngOnInit(): void { }

  asignarRol() { }

  ejecutarMetodos() {
    const promesa1 = Promise.resolve(this.altaDos());
    const promesa2 = Promise.resolve(this.Registrarcorreo());

    Promise.all([promesa1, promesa2])
      .then(() => {
        console.log('Ambos métodos se ejecutaron al mismo tiempo');
      })
      .catch(error => {
        console.error('Error al ejecutar los métodos:', error);
      });
  }

  Registrar() {
    this.firestore.crearRegistro(this.usuario).then((_res => {
      alert("Registrado")
    })).catch(error => {
      alert("Error" + error)
    });

    this.datos.alta(this.usuario).subscribe(res => alert("exitoso"))
  }

  async Registrarcorreo() {
    const { email, password } = this.usuario;

    try {
      // Llama al método registerUser del servicio
      await this.emails.registerUser({ email, password });
      alert('Usuario registrado con éxito. Se ha enviado un correo de confirmación.');
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
      alert('Error al registrar el usuario: ' + error);
    }
  }


  registroGmail() {
    const { email, password } = this.usuario;

    return this.user.register(email, password)
      .then(user => {
        console.log('Usuario registrado:', user);
        // Puedes agregar más lógica aquí después de registrar al usuario
        return user; // Devuelve el usuario registrado
      })
      .catch(error => {
        console.error('Error al registrar el usuario:', error);
        throw error; // Rechaza la promesa si hay un error
      });
  }

  async realizarRegistro() {
    try {
      const user = await this.registroGmail();
      if (user) {
        console.log('Usuario registrado correctamente en Gmail. Realizando registro en MySQL...');
        await this.registroMysql(); // Llama a registroMysql si el usuario se registró correctamente en Gmail
      } else {
        console.log('No se pudo registrar el usuario en Gmail.');
      }
    } catch (error) {
      console.error('Error al realizar el registro:', error);
    }
  }

  registroMysql() {
    // Envía los datos de registro al backend
    this.datos.registerUser(this.usuario)
      .subscribe(
        (response: any) => {
          // El registro fue exitoso, puedes mostrar un mensaje de éxito o redirigir al usuario a la página de inicio de sesión
          console.log('Registro exitoso:', response);
        },
        (error) => {
          console.error('Error en el registro:', error);
          // Aquí puedes mostrar un mensaje de error al usuario
        }
      );
  }

  altaDos() {
    this.datos.alta(this.usuario).subscribe(
      (response: any) => {
        if (response.resultado === 'OK') {
          alert(response.mensaje);
          this.usuario = {
            nombre: '',
            email: '',
            password: '',
            rol: null,
            semestre: null,
            carrera: null
          }
        }
      },
      error => {
        console.error('Error en la solicitud:', error);
        // Manejar el error aquí
      }
    );
  }

}









