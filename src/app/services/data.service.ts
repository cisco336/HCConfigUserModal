import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // API Local
  // API = "http://localhost/Abastecimiento/Servicios/Usuarios/api";

  // APIs
  // DEV
  API = 'http://10.23.14.164:9000/Servicios/Seguridad_1.0.0/api';

  // QA
  // API = "http://10.23.14.163:9000/Servicios/Seguridad_1.0.0/api"

  // PROD
  // API = "http://10.23.18.163:9000/Servicios/Seguridad_1.0.0/api"

  // TEST
  // API = "http://10.23.14.94:9000/Servicios/Seguridad_1.0.0/api"

  // Calls
  // Autenticacion
  userAuthCall = '/Autenticacion/UserAuth?usuario=';

  // Usuario
  userInfoCall = '/Usuario/UserInfo?usuario=';
  tipoUsuarioCall = '/Usuario/GetTipoUsuario';
  areasCall = '/Usuario/GetAreas';
  rolesCall = '/Usuario/GetRoles';
  tiendasCall = '/Usuario/GetTiendas';
  usuariosCall = '/Usuario/GetProveedoresUsuario/';
  setUsuarioCall = '/Usuario/SetUsuario';
  getUsuarioDomCall = '/Usuario/GetUsuarioDom/';

  // Subscription keys
  // DEV
  subscriptionKey = 'dfeb9e69860f45258647cc7ba45fb040';
  // QA
  // subscriptionKey = "442c55ae313642028c9eb69dc4220dad";
  // PROD
  // subscriptionKey = "209fa70e5b0c4b5c8bddaf0aa54b8e19";

  token = new BehaviorSubject<string>('');

  constructor(private http: HttpClient) {}

  protected generateBasicHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': this.subscriptionKey
    });
  }

  protected generateBasicHeadersJWT(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': this.subscriptionKey,
      Authorization: this.token.value
    });
  }

  setToken(data) {
    this.token.next(data);
  }
  userAuth(data) {
    return this.http.get(this.API + this.userAuthCall + data, {
      headers: this.generateBasicHeaders()
    });
  }
  userInfo(data) {
    return this.http.get(this.API + this.userInfo + data, {
      headers: this.generateBasicHeaders()
    });
  }
  tipoUsuario() {
    return this.http.get(this.API + this.tipoUsuarioCall, {
      headers: this.generateBasicHeaders()
    });
  }
  getAreas() {
    return this.http.get(this.API + this.areasCall, {
      headers: this.generateBasicHeaders()
    });
  }
  getRoles() {
    return this.http.get(this.API + this.rolesCall, {
      headers: this.generateBasicHeaders()
    });
  }
  getTiendas() {
    return this.http.get(this.API + this.tiendasCall, {
      headers: this.generateBasicHeaders()
    });
  }
  getUsuarios(data) {
    return this.http.get(this.API + this.usuariosCall + data, {
      headers: this.generateBasicHeaders()
    });
  }
  setUsuario(data) {
    return this.http.post(this.API + this.setUsuarioCall, data, {
      headers: this.generateBasicHeaders()
    });
  }
  getUsuarioDom(data) {
    return this.http.get(this.API + this.getUsuarioDomCall + data, {
      headers: this.generateBasicHeaders()
    });
  }
}
