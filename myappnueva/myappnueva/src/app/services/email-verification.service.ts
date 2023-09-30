import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Auth } from 'firebase/auth';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class EmailVerificationService {
  private hunterApiKey = '16f454b27378e629e2ce9f22a346aeeea1a2c54b';
  url2 = 'http://192.168.0.11:3000/api';
  constructor(private http: HttpClient,private afAuth: AngularFireAuth,) {}

  verifyEmail(email: any) {
    const apiKey = btoa(`:${this.hunterApiKey}`); // Codifica la clave de API de Hunter

    const headers = {
      Authorization: `Basic ${apiKey}`
    };

    const url = `https://api.hunter.io/v2/email-verifier?email=${email}`;

    return this.http.get(url, { headers });
  }

  async sendEmail(){
    return await (await this.afAuth.currentUser)?.sendEmailVerification()
  }

  async registerUser(userData: any): Promise<any> {
    try {
      // Crea el usuario en Firebase Authentication
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(userData.email, userData.password);

    this.sendEmail();
    } catch (error) {
      console.error('Error en el registro:', error);
      throw error;
    }
  }



}


