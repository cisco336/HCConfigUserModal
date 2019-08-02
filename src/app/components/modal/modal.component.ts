import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ElementRef
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { DataService } from "src/app/services/data.service";

export interface UserDom {
  Nombres: string;
  Apellidos: string;
  Documento: number;
  Email: string;
}

@Component({
  selector: "app-modal",
  templateUrl: "./modal.component.html",
  styleUrls: ["./modal.component.scss"]
})
export class ModalComponent implements OnInit {
  @ViewChild("tipoSelect", { static: false }) tipoSelect: ElementRef;
  @ViewChild("dominioInput", { static: false }) dominioInput: ElementRef;
  @ViewChild("identificacionInput", { static: false })
  identificacionInput: ElementRef;
  @ViewChild("userTagInput", { static: false }) userTagInput: ElementRef;
  @ViewChild("nombreInput", { static: false }) nombreInput: ElementRef;
  @ViewChild("apellidoInput", { static: false }) apellidoInput: ElementRef;
  @ViewChild("passwordInput", { static: false }) passwordInput: ElementRef;
  @ViewChild("emailInput", { static: false }) emailInput: ElementRef;
  @ViewChild("areaSelect", { static: false }) areaSelect: ElementRef;
  @ViewChild("rolSelect", { static: false }) rolSelect: ElementRef;
  @ViewChild("tiendaSelect", { static: false }) tiendaSelect: ElementRef;
  @ViewChild("activoToggle", { static: false }) activoToggle: ElementRef;

  defaultImg: string = "assets/img/default-user-profile-image-png-2.png";
  userImg: string = "";
  tipoUsuario: any[] = [];
  areas: any[] = [];
  roles: any[] = [];
  tiendas: any[] = [];
  userTag: any[] = [];
  isLoading: boolean = true;
  error: string = "";
  userDom: UserDom;

  // TOKEN SGL
  sub: any;
  tokenSGL: string;
  usr: string = "";

  constructor(
    private route: ActivatedRoute,
    private _dataService: DataService,
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnInit() {
    this.getUser(() => {});
  }
  getUser(callback) {
    this.getToken(() => {
      this.usr = this.tokenSGL == null ? "" : this.tokenSGL;
    });
    callback();
  }
  getToken(callback) {
    this.tokenSGL = this.route.snapshot.queryParams.token;
    this.sub = this.route.queryParams.subscribe(params => {
      this.tokenSGL = params.token;
      if (this.usr !== undefined) {
        this.appStart();
      }
      callback();
    });
  }
  appStart() {
    this._dataService
      .tipoUsuario()
      .toPromise()
      .then(data => {
        if (data) {
          console.log(data);
          this.tipoUsuario = data["Value"];
          this.isLoading = false;
        }
      })
      .catch(error => {
        this.error = "Error de comunicación.";
        setTimeout(() => {
          this.error = "";
        }, 5000);
      });
    this._dataService
      .getAreas()
      .toPromise()
      .then(data => {
        if (data) {
          console.log(data);
          this.areas = data["Value"];
          this.isLoading = false;
        }
      })
      .catch(error => {
        this.error = "Error de comunicación.";
        setTimeout(() => {
          this.error = "";
        }, 5000);
      });
    this._dataService
      .getRoles()
      .toPromise()
      .then(data => {
        if (data) {
          console.log(data);
          this.roles = data["Value"];
          this.isLoading = false;
        }
      })
      .catch(error => {
        this.error = "Error de comunicación.";
        setTimeout(() => {
          this.error = "";
        }, 5000);
      });
    this._dataService
      .getTiendas()
      .toPromise()
      .then(data => {
        if (data) {
          console.log(data);
          this.tiendas = data["Value"];
          this.isLoading = false;
        }
      })
      .catch(error => {
        this.error = "Error de comunicación.";
        setTimeout(() => {
          this.error = "";
        }, 5000);
      });
  }

  getUserTag(event) {
    this._dataService
      .getUsuarios(event.value.TAG)
      .toPromise()
      .then(data => {
        if (data) {
          console.log(data);
          this.userTag = data["Value"];
          this.isLoading = false;
        }
      })
      .catch(error => {
        this.error = "Error de comunicación.";
        setTimeout(() => {
          this.error = "";
        }, 5000);
      });
  }

  setUsuario() {
    let data = {
      usuarios: {
        p_Transaccion: "",
        p_Id_Usuario: "",
        p_Usuario_Dominio: this.dominioInput["nativeElement"]["value"] || "",
        p_Nombres: this.nombreInput["nativeElement"]["value"] || "",
        p_Apellidos: this.apellidoInput["nativeElement"]["value"] || "",
        p_Documento: this.identificacionInput["nativeElement"]["value"] || "",
        p_Id_Tipo_Usuario: this.tipoSelect["value"]["ID"] || "",
        p_Id_Rol: this.rolSelect["value"]["ID"] || "",
        p_Org_Lvl_Child: "",
        p_Vpc_Tech_Key: "",
        p_Skyn_Style: "",
        p_Id_Area: this.areaSelect["value"]["ID"] || "",
        p_Email: this.emailInput["nativeElement"]["value"] || "",
        p_Clave: this.passwordInput["nativeElement"]["value"] || "",
        p_Ruta_Foto: "",
        p_Activo: this.activoToggle["checked"] || "",
        p_Usuario: ""
      }
    };
    let transaccion;
    let idUsuario;
    let p_Org_Lvl_Child;
    let p_Vpc_Tech_Key;
    let p_Skyn_Style;
    let p_Ruta_Foto;
    let p_Usuario;
    let query = `usuarios.p_Transaccion=${transaccion ||
      ""}&usuarios.p_Id_Usuario=${idUsuario ||
      ""}&usuarios.p_Usuario_Dominio=${this.dominioInput["nativeElement"][
      "value"
    ].toUpperCase()}&usuarios.p_Nombres=${
      this.nombreInput["nativeElement"]["value"]
    }&usuarios.p_Apellidos=${
      this.apellidoInput["nativeElement"]["value"]
    }&usuarios.p_Documento=${
      this.identificacionInput["nativeElement"]["value"]
    }&usuarios.p_Id_Tipo_Usuario=${
      this.tipoSelect["value"]["ID"]
    }&usuarios.p_Id_Rol=${
      this.rolSelect["value"]["ID"]
    }&usuarios.p_Org_Lvl_Child=${p_Org_Lvl_Child ||
      ""}&usuarios.p_Vpc_Tech_Key=${p_Vpc_Tech_Key ||
      ""}&usuarios.p_Skyn_Style=${p_Skyn_Style || ""}&usuarios.p_Id_Area=${
      this.areaSelect["value"]["ID"]
    }&usuarios.p_Email=${
      this.emailInput["nativeElement"]["value"]
    }&usuarios.p_Clave=${
      this.passwordInput["nativeElement"]["value"]
    }&usuarios.p_Ruta_Foto=${p_Ruta_Foto || ""}&usuarios.p_Activo=${
      this.activoToggle["checked"]
    }&usuarios.p_Usuario=${p_Usuario || ""}`;
    console.log(query);
    // this._dataService.setUsuario(data).toPromise().then(
    //   data => {
    //     console.log(data)
    //   },
    //   error => {
    //     console.log(error)
    //   }
    // );
  }

  getUsuarioDom(data) {
    let query = {
      UserName: data,
      Password: "@cel032018"
    };
    console.log(query);
    this._dataService
      .getUsuarioDom(query)
      .toPromise()
      .then(response => {
        console.log(response);
        this.userDom = response["Value"] ? { ...response["Value"] } : null;
      })
      .catch(error => {
        console.log(error);
        this.error = "Error de comunicación";
      });
  }

  closeDialog(data?) {
    this.dialogRef.close(data);
  }
}
