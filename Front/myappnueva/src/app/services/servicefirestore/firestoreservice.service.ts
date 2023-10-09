import { Injectable } from '@angular/core';
import { initializeApp } from '@angular/fire/app';
import { AngularFirestoreModule , AngularFirestoreCollection, AngularFirestore} from '@angular/fire/compat/firestore';
import * as firebase from 'firebase/compat';


import { environment } from 'src/environments/environment';
import {Observable} from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class FirestoreserviceService {
  getUsers() {
    throw new Error('Method not implemented.');
  }
  collection<T>(arg0: string): any {
    throw new Error('Method not implemented.');
  }



  // Required for side-effects
  constructor(private firestore: AngularFirestore) {}





  crearRegistro(registro:any){
return this.firestore.collection('usuario').add(registro);

}
crearRegistrocitas(registro:any){
  return this.firestore.collection('citas').add(registro);

  }
mostrarRegistro(){
  return this.firestore.collection('usuario').snapshotChanges();
}

 mostrarRegistrounico(id:any):Observable<any>{
return this.firestore.collection('citas').doc(id).snapshotChanges();
 }
mostrarRegistrocitas(){
  return this.firestore.collection('citas').snapshotChanges();
}

actualizarRegistro(id:any, registro:any){
  return this.firestore.collection('citas').doc(id).update(registro);
}
}
