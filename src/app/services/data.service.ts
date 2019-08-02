import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: "root"
})
export class DataService {
  // API Local
  API = "http://localhost/Abastecimiento/Servicios/Usuarios/api";

  // Calls
  // Autenticacion
  userAuthCall = "/Autenticacion/UserAuth?usuario=";

  // Usuario
  userInfoCall = "/Usuario/UserInfo?usuario=";
  tipoUsuarioCall = "/Usuario/GetTipoUsuario";
  areasCall = "/Usuario/GetAreas";
  rolesCall = "/Usuario/GetRoles";
  tiendasCall = "/Usuario/GetTiendas";
  usuariosCall = "/Usuario/GetUsuarios/";
  setUsuarioCall = "/Usuario/SetUsuario?";
  getUsuarioDomCall = "/Usuario/GetUsuarioDom/";

  token = new BehaviorSubject<string>("");
  
  constructor(private http: HttpClient) {}

  protected generateBasicHeaders(): HttpHeaders {
    return new HttpHeaders({
      "Content-Type": "application/json",
      "Ocp-Apim-Subscription-Key": "9b33c33d833340e0839653420edf6a89",
    });
  }

  protected generateBasicHeadersJWT(): HttpHeaders {
    return new HttpHeaders({
      "Content-Type": "application/json",
      "Ocp-Apim-Subscription-Key": "dfeb9e69860f45258647cc7ba45fb040",
      Authorization: this.token.value,
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
    console.log(data)
    return this.http.get(this.API + this.usuariosCall + '/' + data, {
      headers: this.generateBasicHeaders()
    });
  }
  setUsuario(data) {
    // data debe contener
      // p_Transaccion: '',
      // p_Id_Usuario: '',
      // p_Usuario_Dominio: '',
      // p_Nombres: '',
      // p_Apellidos: '',
      // p_Documento: '',
      // p_Id_Tipo_Usuario: '',
      // p_Id_Rol: '',
      // p_Org_Lvl_Child: '',
      // p_Vpc_Tech_Key: '',
      // p_Skyn_Style: '',
      // p_Id_Area: '',
      // p_Email: '',
      // p_Clave: '',
      // p_Ruta_Foto: '',
      // p_Activo: '',
      // p_Usuario: ''
    return this.http.get(this.API + this.setUsuarioCall + data, {
      headers: this.generateBasicHeaders()
    });
  }
  getUsuarioDom(data) {

    // {
    //   "UserName":"ACEL03",
    //   "Password":"@cel032018"
    // }
    // {
    //   "Estado": true,
    //   "Mensaje": "Sentencia ejecutada con éxito.",
    //   "Value": {
    //     "Nombres": "Jair Alejandro",
    //     "Apellidos": "Acevedo Londono",
    //     "Documento": "4519300",
    //     "Email": "jacevedo@homecenter.co"
    //   }
    // }
    
    return this.http.post('http://localhost/Aplicaciones/Usuarios/api' + this.getUsuarioDomCall, data, { headers: this.generateBasicHeaders() })
  }
}
