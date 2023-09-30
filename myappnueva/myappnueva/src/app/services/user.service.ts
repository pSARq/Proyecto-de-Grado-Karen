import { Injectable } from '@angular/core';
import { User } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { DatosService } from './datos.service';
import { AngularFireFunctions } from '@angular/fire/compat/functions';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  usuarios: any

  constructor(private auth: AngularFireAuth, private firestore: AngularFirestore, private dato: DatosService, private functions: AngularFireFunctions) {}

  async register(email: string, password: string): Promise<any> {
    try {
      const { user } = await this.auth.createUserWithEmailAndPassword(
        email,
        password
      );
      await this.sendVerificationEmail();

      return user;
    } catch (error) {
      console.log(error);
    }
  }

  //USUARIOS REGISTRADOS
  async sendVerificationEmail() {
    try {
      const user = await this.auth.currentUser;
      if (user) {
        return await (await this.auth.currentUser)?.sendEmailVerification()
      } else {
        // El usuario no está autenticado. Debes manejar este caso según tus necesidades.
        // Por ejemplo, redirigirlo a la página de inicio de sesión.
      }
    } catch (error) {
      alert("Error al enviar el correo de verificación: " + error);
    }
  }

  async sendEmail(to: string, subject: string, message: string) {
    try {
      // Llama a la función de Firebase para enviar correos electrónicos personalizados
      const sendEmail = this.functions.httpsCallable('sendEmail');
      const result = await sendEmail({ to, subject, message }).toPromise();
      console.log('Correo electrónico enviado:', result);
      return result;
    } catch (error) {
      console.error('Error al enviar el correo electrónico:', error);
      throw error;
    }
  }

  async login(email: string, password: string) {
    try {
      return await this.auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      alert("ERROR LOGIN :" + error)
      return null;
    }

  }

  async loginWithGoogle(email: string, password: string) {
    try {
      return await this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    } catch (error) {
      alert("ERROR LOGIN :" + error)
      return null;
    }
  }

  getUserLogged() {
    return this.auth.authState;

  }

  logOut() {
    this.auth.signOut();
  }

  async resetPassword(email: string) {
    try {
      return await this.auth.sendPasswordResetEmail(email)
    } catch (error) {
      alert("RESET PASS :" + error)
    }
  }

  async getUid() {
    const user = await this.auth.currentUser;
    return user?.uid
  }

}
