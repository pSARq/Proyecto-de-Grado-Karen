import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, forkJoin, of, throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DatosService {

  private jwtHelper: JwtHelperService = new JwtHelperService();
  private userDataSubject = new BehaviorSubject<any>(null);
  userData$ = this.userDataSubject.asObservable();
  private idEstudiante: string = '';
  private idDirectivo: string = "";

  url = 'http://localhost:3000/api/login';
  url2 = 'http://192.168.43.143:3000/api';
  url3 = "http://192.168.43.143:3000/api/solicitudes";
  url4 = 'http://localhost:3000/api/'; //
  url5 = 'http://localhost:3000/api';
  url6 = "http://localhost:3000/api"
  url7 = "https://rickandmortyapi.com/api"
  // private refreshTokenEndpoint = 'http://192.168.43.143:3000/api/refresh-token';
  private refreshTokenEndpoint = 'http://localhost:3000/api/refresh-token';
  // disponer url de su servidor que tiene las páginas PHP



  constructor(private http: HttpClient) { }

  usuario = {
    email: '',
    password: '',
    id: 0
  }

  private idEstudianteKey = 'idEstudiante';
  private idDirectivoKey = 'idDirectivo';

  consultaExitosa: boolean = false;
  datosConsulta: any = {};
  private roleKey = 'role';
  private tokenKey = 'token';


  refreshToken(): Observable<any> {
    const currentToken = this.getToken();

    if (!currentToken) {
      console.error('Token no encontrado. El usuario no está autenticado.');
      return throwError('Token no encontrado.');
    }

    // Enviar la solicitud al servidor para refrescar el token utilizando el token actual
    const headers = new HttpHeaders({
      Authorization: `Bearer ${currentToken}`
    });

    return this.http.post<any>(this.refreshTokenEndpoint, null, { headers }).pipe(
      tap((response: any) => {
        console.log("Metodo antes: " + headers)
        // Actualizar el token almacenado en el cliente con el nuevo token recibido en la respuesta.
        const newToken = response.token; // Asume que el nuevo token se encuentra en una propiedad "token" de la respuesta.
        this.setToken(newToken);

        console.log('Token refrescado exitosamente' + " " + this.getToken());
      }),
      catchError((error) => {
        console.error('Error al refrescar el token:', error);
        return throwError('Error al refrescar el token');
      })
    );
  }

  isUserLoggedIn() {
    const token = localStorage.getItem(this.tokenKey);
    // Si el token existe y no está expirado, el usuario está logueado
    return token && !this.jwtHelper.isTokenExpired(token);
  }

  registerUser(userData: any): Observable<any> {
    return this.http.post<any>(`${this.url2}/register`, userData);
  }

  registerUserWithGmail(email: string) {
    // Llama al método de registro con Gmail del backend
    return this.http.post<any>(`${this.url2}/registerWithGmail`, { email });
  }

  setUserData(userData: any) {
    this.userDataSubject.next(userData);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.url}`, { email, password }).pipe(
      tap(response => {
        // Comprobamos si el token existe en la respuesta del backend
        if (response.token) {
          // Guardamos el token en el almacenamiento local (localStorage)
          localStorage.setItem('token', response.token);

          // Decodificamos el token y obtenemos la información del usuario (en este caso, el email e id_estudiante)
          const decodedToken = this.jwtHelper.decodeToken(response.token);
          this.usuario.email = decodedToken.email;
          this.usuario.id = decodedToken.id; // Actualiza a id_estudiante
          this.setIdEstudiante(response.id); // Almacena el ID del estudiante


        } else {
          this.usuario.email = response.email;
        }
        this.usuario.password = response.password;
      }),
      catchError(() => {
        this.consultaExitosa = false;
        return of(null);
      })
    );
  }

  setIdEstudiante(id: string) {
    this.idEstudiante = id;
    localStorage.setItem(this.idEstudianteKey, id); // Almacena el ID en el localStorage
  }

  verifyToken(email: string): Observable<any> {

    const currentToken = this.getToken();

    if (!currentToken) {
      console.error('Token no encontrado. El usuario no está autenticado.');
      return throwError('Token no encontrado.');
    }

    // Enviar la solicitud al servidor para refrescar el token utilizando el token actual
    const headers = new HttpHeaders({
      Authorization: `Bearer ${currentToken}`
    });

    return this.http.post(`${this.url2}/verify-token`, { email, currentToken }, { headers });
  }


  getIdEstudiante(): string {
    if (!this.idEstudiante) {
      // Si el ID no está en la memoria, intenta obtenerlo del localStorage
      this.idEstudiante = localStorage.getItem(this.idEstudianteKey) || '';
    }
    return this.idEstudiante;
  }

  setDirectivoId(id: string) {
    this.idDirectivo = id;
    localStorage.setItem(this.idDirectivoKey, id); // Almacena el ID del directivo en el localStorage
  }

  getDirectivoId(): string {
    if (!this.idDirectivo) {
      // Si el ID no está en la memoria, intenta obtenerlo del localStorage
      this.idDirectivo = localStorage.getItem(this.idDirectivoKey) || '';
    }
    return this.idDirectivo;
  }
  setRole(role: string): void {
    localStorage.setItem(this.roleKey, role);
  }



  // Servicio
  mostrarSolicitudes(): Observable<any> {
    const currentToken = this.getToken();

    if (!currentToken) {
      console.error('Token no encontrado. El usuario no está autenticado.');
      return throwError('Token no encontrado.');
    }

    // Agrega el token a la cabecera de la solicitud
    const headers = new HttpHeaders({
      Authorization: `Bearer ${currentToken}`
    });
    // Realiza la petición GET a la URL correspondiente
    return this.http.get(`${this.url6}/consultadeSolicitudes`, { headers });
  }

  tablaConsulta(): Observable<any> {
    const currentToken = this.getToken();

    if (!currentToken) {
      console.error('Token no encontrado. El usuario no está autenticado.');
      return throwError('Token no encontrado.');
    }

    // Agrega el token a la cabecera de la solicitud
    const headers = new HttpHeaders({
      Authorization: `Bearer ${currentToken}`
    });
    // Realiza la petición GET a la URL correspondiente
    return this.http.get(`${this.url6}/tablaConsulta`, { headers });
  }




  registrarSolicitud(solicitud: any): Observable<any> {
    const currentToken = this.getToken();

    if (!currentToken) {
      console.error('Token no encontrado. El usuario no está autenticado.');
      return throwError('Token no encontrado.');
    }

    // Agrega el token a la cabecera de la solicitud
    const headers = new HttpHeaders({
      Authorization: `Bearer ${currentToken}`
    });

    return this.http.post<any>(`${this.url3}`, solicitud, { headers }).pipe(
      // Resto del código...
    );
  }

  // Resto del código del servicio


  setTokenAndRole(token: string, role: string): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.roleKey, role);
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getRole(): string | null {
    return localStorage.getItem(this.roleKey);
  }



  clearStorage(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey);
  }

  recuperarTodosID(filtro: any, filtro2: any) {
    const urlConFiltro = `${this.url}seleccionar.php?Filtro=${filtro}&Filtro2=${filtro2}`;
    return this.http.get(urlConFiltro).pipe(
      tap((response: any) => {
        this.consultaExitosa = true;
        // Comprobamos si el token existe en la respuesta del backend
        if (response.token) {
          // Guardamos el token en el almacenamiento local (localStorage)
          localStorage.setItem('token', response.token);
          // Decodificamos el token y obtenemos la información del usuario (en este caso, el email)
          const decodedToken = this.jwtHelper.decodeToken(response.token);
          this.usuario.email = decodedToken.email;
        } else {
          this.usuario.email = response.email;
        }
        this.usuario.password = response.password;
      }),
      catchError(() => {
        this.consultaExitosa = false;
        return of(null);
      })
    );
  }

  //




  //
  recuperarSolicitudes(idEstudiante: string): Observable<any> {
    // Obtén el token del almacenamiento local (localStorage)
    const currentToken = this.getToken();

    if (!currentToken) {
      console.error('Token no encontrado. El usuario no está autenticado.');
      return throwError('Token no encontrado.');
    }

    // Enviar la solicitud al servidor para refrescar el token utilizando el token actual
    const headers = new HttpHeaders({
      Authorization: `Bearer ${currentToken}`
    });



    // Realiza la petición GET a la URL correspondiente, incluyendo el idEstudiante en la URL
    return this.http.get(`${this.url4}consultaSolicitud/${idEstudiante}`, { headers });
  }


  // Método para eliminar una solicitud por su ID
  eliminarSolicitud(idSolicitud: string): Observable<any> {
    // Obtén el token del almacenamiento local (localStorage)
    const currentToken = this.getToken();

    if (!currentToken) {
      console.error('Token no encontrado. El usuario no está autenticado.');
      return throwError('Token no encontrado.');
    }

    // Agrega el token a la cabecera de la solicitud
    const headers = new HttpHeaders({
      Authorization: `Bearer ${currentToken}`
    });

    // Realiza la solicitud HTTP DELETE para eliminar la solicitud por su ID
    const url = `${this.url3}/${idSolicitud}`;
    return this.http.delete(url, { headers }).pipe(
      catchError((error) => {
        console.error('Error en la solicitud de eliminación de la solicitud:', error);
        return throwError('Error en la solicitud de eliminación de la solicitud.');
      })
    );
  }


  recuperarSolicitudesres(idEstudiante: string): Observable<any> {
    // Obtén el token del almacenamiento local (localStorage)
    const currentToken = this.getToken();

    if (!currentToken) {
      console.error('Token no encontrado. El usuario no está autenticado.');
      return throwError('Token no encontrado.');
    }

    // Enviar la solicitud al servidor para refrescar el token utilizando el token actual
    const headers = new HttpHeaders({
      Authorization: `Bearer ${currentToken}`
    });



    // Realiza la petición GET a la URL correspondiente, incluyendo el idEstudiante en la URL
    return this.http.get(`${this.url4}consulta/${idEstudiante}`, { headers });
  }



  editarSolicitud(id: number, nuevaSolicitud: any, token: string): Observable<any> {
    // Agrega el token a la cabecera de la solicitud
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const url = `${this.url5}/editarSolicitud/${id}`;
    return this.http.put<any>(url, nuevaSolicitud, { headers }).pipe(
      catchError((error) => {
        console.error('Error en la solicitud:', error);
        return throwError('Error en la solicitud.');
      })
    );
  }

  recuperarSolicitudesYEstado(idEstudiante: string): Observable<any> {
    // Combine the observables using forkJoin
    return forkJoin({
      solicitudes: this.recuperarSolicitudes(idEstudiante),


    });
  }
  recuperarEstado(id: any, consulta_id: any): Observable<any> {
    // Obtén el token del almacenamiento local (localStorage)
    const currentToken = this.getToken();

    if (!currentToken) {
      console.error('Token no encontrado. El usuario no está autenticado.');
      return throwError('Token no encontrado.');
    }

    // Enviar la solicitud al servidor para refrescar el token utilizando el token actual
    const headers = new HttpHeaders({
      Authorization: `Bearer ${currentToken}`
    });



    // Realiza la petición GET a la URL correspondiente, incluyendo el idEstudiante en la URL
    return this.http.get(`${this.url4}consultaEstados/${id}/${consulta_id}`, { headers });
  }



  insertarConsulta(consultaData: any): Observable<any> {
    const url = `${this.url5}/insertarConsulta`;
    return this.http.post<any>(url, consultaData).pipe(
      catchError((error) => {
        console.error('Error en la solicitud de inserción en la tabla "consulta":', error);
        return throwError('Error en la solicitud de inserción en la tabla "consulta".');
      })
    );
  }

  actualizarEstadoSolicitud(id: string, estado: string): Observable<any> {
    const url = `${this.url5}/actualizarEstadoSolicitud/${id}`;
    return this.http.post<any>(url, { estado });
  }

  responderSolicitudes(id: any, nuevaSolicitud: any): Observable<any> {
    // Agrega el token a la cabecera de la solicitud

    // Construir la URL para la nueva ruta de insertRespuestas
    const url = `${this.url5}/insertRespuestas/${id}`;

    // Realizar la solicitud HTTP POST a la nueva ruta
    return this.http.post<any>(url, nuevaSolicitud).pipe(
      catchError((error) => {
        console.error('Error en la solicitud:', error);
        return throwError('Error en la solicitud.');
      })
    );
  }



  alta(registrouser: any) {
    return this.http.post(`${this.url}alta.php`, JSON.stringify(registrouser));
  }

  altaUser(reg: any) {
    return this.http.post(`${this.url}altauser.php`, JSON.stringify(reg));
  }

  baja(email: string) {


    const urlConFiltro = `${this.url}baja.php?email=${email}`;
    return this.http.get(urlConFiltro);

  }

  seleccionar(codigo: number) {
    return this.http.get(`${this.url}seleccionar.php?codigo=${codigo}`);
  }



  modificacion(articulo: any) {
    return this.http.post(`${this.url}modificacion.php`, JSON.stringify(articulo));
  }
}
