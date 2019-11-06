import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  ViewChild,
  ElementRef
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { DataService } from "src/app/services/data.service";
import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger
} from "@angular/animations";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from "@angular/forms";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { NgSelectConfig } from "@ng-select/ng-select";
import { RequireMatch } from "./customValidators";

export interface UserDom {
  Nombres: string;
  Apellidos: string;
  Documento: string;
  Email: string;
}

export interface Proveedor {
  ID: number;
  DESCRIPCION: string;
}

@Component({
  selector: "app-modal",
  templateUrl: "./modal.component.html",
  styleUrls: ["./modal.component.scss"],
  animations: [
    trigger("fade", [
      transition("* => *", [
        // each time the binding value changes
        query(
          ":leave",
          [stagger(100, [animate("0.5s", style({ opacity: 0 }))])],
          { optional: true }
        ),
        query(
          ":enter",
          [
            style({ opacity: 0 }),
            stagger(100, [animate("0.5s", style({ opacity: 1 }))])
          ],
          { optional: true }
        )
      ])
    ])
  ]
})
export class ModalComponent implements OnInit, OnDestroy {
  @ViewChild("tipoSelect", { static: false }) tipoSelect: ElementRef;
  @ViewChild("dominioInput", { static: false }) dominioInput: ElementRef;
  @ViewChild("identificacionInput", { static: false })
  identificacionInput: ElementRef;
  @ViewChild("userTagInput", { static: false }) userTagInput: ElementRef;
  @ViewChild("nombreInput", { static: false }) nombreInput: ElementRef;
  @ViewChild("apellidoInput", { static: false }) apellidoInput: ElementRef;
  @ViewChild("emailInput", { static: false }) emailInput: ElementRef;
  @ViewChild("areaSelect", { static: false }) areaSelect: ElementRef;
  @ViewChild("rolSelect", { static: false }) rolSelect: ElementRef;
  @ViewChild("tiendaSelect", { static: false }) tiendaSelect: ElementRef;
  @ViewChild("activoToggle", { static: false }) activoToggle: ElementRef;
  @ViewChild("saveButton", { static: false }) saveButton: ElementRef;

  defaultImg: string = "assets/img/default-user-profile-image-png-2.png";
  tipoUsuario: any[] = [];
  areas: any[] = [];
  roles: any[] = [];
  tiendas: any[] = [];
  userTag: any[] = [];
  usrData: any[] = [];
  isLoading: boolean = true;
  prLoading: boolean = false;
  selectDisabled: boolean = true;
  errorSuccess: boolean = false;
  proveedorDisabled: boolean = false;
  saveDisabled: boolean = false;
  userImg: string = "";
  error: string = "";
  transaction: string = "C";
  userDom: UserDom;
  filteredUserTag: Observable<Proveedor[]>;
  filteredAreas: Observable<Proveedor[]>;
  filteredRoles: Observable<Proveedor[]>;
  filteredTiendas: Observable<Proveedor[]>;

  // TOKEN SGL
  sub: any;
  tokenSGL: string;
  usr: string = "";

  form: FormGroup;

  proveedorSubscription;

  constructor(
    private route: ActivatedRoute,
    private _dataService: DataService,
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    fb: FormBuilder,
    private config: NgSelectConfig
  ) {
    this.config.notFoundText = "No hay datos";
    this.form = fb.group({
      frdominioInput: ["", Validators.required],
      frtipoSelect: ["", [RequireMatch]],
      fridentificacionInput: [{ value: "", disabled: true }],
      frProveedor: [
        { value: "", disabled: true },
        [Validators.required, RequireMatch]
      ],
      frnombreInput: [{ value: "", disabled: true }],
      frapellidoInput: [{ value: "", disabled: true }],
      fremailInput: [{ value: "", disabled: true }],
      frareaSelect: ["", [RequireMatch]],
      frrolSelect: ["", [RequireMatch]],
      frtiendaSelect: ["", [RequireMatch]],
      fractivoToggle: [""]
    });
  }
  ngOnInit() {
    this.disableEnableForm(false);
    this.getUser(() => {});
    this.userTagData();
    this.filteredAreas = this.form.get("frareaSelect").valueChanges.pipe(
      startWith(""),
      map(value => (typeof value === "string" ? value : null)),
      map(name => (name ? this._filterAreas(name) : this.areas.slice()))
    );
    this.filteredRoles = this.form.get("frrolSelect").valueChanges.pipe(
      startWith(""),
      map(value => (typeof value === "string" ? value : null)),
      map(name => (name ? this._filterRoles(name) : this.roles.slice()))
    );
    this.filteredTiendas = this.form.get("frtiendaSelect").valueChanges.pipe(
      startWith(""),
      map(value => (typeof value === "string" ? value : null)),
      map(name => (name ? this._filterTiendas(name) : this.tiendas.slice()))
    );

    this.proveedorSubscription = this.form
      .get("frtipoSelect")
      .valueChanges.subscribe(data => {
        if (!data || data.TAG === "-1") {
          this.form.get("frProveedor").disable();
        } else {
          this.form.get("frProveedor").enable();
          this.prLoading = false;
        }
      });
  }

  ngOnDestroy() {
    this.proveedorSubscription.unsubscribe();
  }

  private _filterProveedor(value: string): Proveedor[] {
    const filterValue = value ? value.toLowerCase() : null;

    return this.userTag.filter(
      option => option.DESCRIPCION.toLowerCase().indexOf(filterValue) >= 0
    );
  }
  private _filterAreas(value: string): Proveedor[] {
    const filterValue = value ? value.toLowerCase() : null;

    return this.areas.filter(
      option => option.DESCRIPCION.toLowerCase().indexOf(filterValue) >= 0
    );
  }
  private _filterRoles(value: string): Proveedor[] {
    const filterValue = value ? value.toLowerCase() : null;

    return this.roles.filter(
      option => option.DESCRIPCION.toLowerCase().indexOf(filterValue) >= 0
    );
  }
  private _filterTiendas(value: string): Proveedor[] {
    const filterValue = value ? value.toLowerCase() : null;

    return this.tiendas.filter(
      option => option.DESCRIPCION.toLowerCase().indexOf(filterValue) >= 0
    );
  }

  displayFilteredProveedor(data?: Proveedor): string | undefined {
    return data ? data.DESCRIPCION : undefined;
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
    this.setRequired(1);
    this._dataService
      .tipoUsuario()
      .toPromise()
      .then(data => {
        this.saveButton["disabled"] = true;
        if (data) {
          this.tipoUsuario = data["Value"];
          this.isLoading = false;
        }
      })
      .catch(error => {
        this.error = "Error de comunicación.";
        this.resetForm();
        setTimeout(() => {
          this.error = "";
        }, 5000);
      });
    this._dataService
      .getAreas()
      .toPromise()
      .then(data => {
        if (data) {
          this.areas = data["Value"];
          this.isLoading = false;
        }
      })
      .catch(error => {
        this.error = "Error de comunicación.";
        this.resetForm();
        setTimeout(() => {
          this.error = "";
        }, 5000);
      });
    this._dataService
      .getRoles()
      .toPromise()
      .then(data => {
        if (data) {
          this.roles = data["Value"];
          this.isLoading = false;
        }
      })
      .catch(error => {
        this.error = "Error de comunicación.";
        this.resetForm();
        setTimeout(() => {
          this.error = "";
        }, 5000);
      });
    this._dataService
      .getTiendas()
      .toPromise()
      .then(data => {
        if (data) {
          this.tiendas = data["Value"];
          this.isLoading = false;
        }
      })
      .catch(error => {
        this.error = "Error de comunicación.";
        this.resetForm();
        setTimeout(() => {
          this.error = "";
        }, 5000);
      });
  }

  userTagData() {
    this.filteredUserTag = this.form.get("frProveedor").valueChanges.pipe(
      startWith(""),
      map(value => (typeof value === "string" ? value : null)),
      map(name => (name ? this._filterProveedor(name) : this.userTag.slice()))
    );
  }

  getUserTag(event, key?) {
    this.prLoading = true;
    if (event && event.value && event.value.TAG) {
      this._dataService
        .getUsuarios(event.value.TAG)
        .toPromise()
        .then(data => {
          this.isLoading = true;
          this.proveedorDisabled = data["Estado"];
          if (data["Estado"]) {
            this.userTag = data["Value"];
            this.userTagData();
          } else {
            this.userTag = [];
            this.userTagData();
          }
          this.isLoading = false;
          this.prLoading = false;
        })
        .catch(error => {
          this.error = "Error de comunicación.";
          this.resetForm();
          setTimeout(() => {
            this.error = "";
            this.isLoading = false;
            this.prLoading = false;
          }, 5000);
        });
    } else if (event && event.TAG) {
      this._dataService
        .getUsuarios(event.TAG)
        .toPromise()
        .then(data => {
          if (data["Mensaje"]) {
            this.userTag = data["Value"];
            let userTag = data["Value"].filter(s => s.ID === key) || null;
            if (userTag.length > 0) {
              this.form.get("frProveedor").setValue(userTag[0]);
            }
            this.prLoading = false;
          }
        });
    } else {
      this.prLoading = false;
    }
  }

  setUsuario(transaccion?) {
    let form = this.form;
    let data = {
      p_Transaccion: transaccion || this.transaction,
      p_Id_Usuario: this.usrData["ID_USUARIO"] || -1,
      p_Usuario_Dominio: this.dominioInput["nativeElement"][
        "value"
      ].toUpperCase(),
      p_Nombres: this.nombreInput.nativeElement.value,
      p_Apellidos: this.apellidoInput.nativeElement.value,
      p_Documento: this.identificacionInput.nativeElement.value,
      p_Id_Tipo_Usuario: form.get("frtipoSelect").value["ID"],
      p_Id_Rol: form.get("frrolSelect").value["ID"],
      p_Org_Lvl_Child: form.get("frtiendaSelect").value["ID"],
      p_Vpc_Tech_Key:
        form.get("frtipoSelect").value["TAG"] === "-1"
          ? 0
          : form.get("frProveedor").value
          ? form.get("frProveedor").value["ID"]
          : 0,
      p_Skyn_Style: this.usrData["SKINSTYLE"] || "Office 2013",
      p_Id_Area: form.get("frareaSelect").value["ID"],
      p_Email: this.emailInput.nativeElement.value,
      P_Clave: this.usrData["CLAVE"] || "xxx",
      p_Ruta_Foto: this.usrData["RUTA_FOTO"] || "",
      p_Activo: this.activoToggle["checked"] ? 1 : 0,
      p_Usuario: this.usr.split(";")[0]
    };

    this._dataService
      .setUsuario(data)
      .toPromise()
      .then(
        response => {
          if (!response["Estado"]) {
            this.error = "Error: " + response["Mensaje"];
          } else {
            this.isLoading = true;
            this.errorSuccess = true;
            this.error = response["Mensaje"];
          }
          setTimeout(() => {
            this.error = "";
            this.errorSuccess = false;
            this.closeDialog();
          }, 5000);
        },
        error => {
          this.error = "Error: " + error;
        }
      );
  }

  getUsuarioDom(data, transaccion) {
    data = data.toUpperCase();
    this._dataService
      .getUsuarioDom(data)
      .toPromise()
      .then(response => {
        this.isLoading = true;
        if (response["Estado"]) {
          this.saveButton["disabled"] = false;
          this.userDom = response["Value"] ? { ...response["Value"] } : null;
          this.nombreInput.nativeElement.value = response["Value"]["Nombres"];
          this.apellidoInput.nativeElement.value =
            response["Value"]["Apellidos"];
          this.identificacionInput.nativeElement.value =
            response["Value"]["Documento"];
          this.emailInput.nativeElement.value = response["Value"]["Email"];
          this.selectDisabled = false;
          this.transaction = "U";
          this.disableEnableForm(true);
          this.setRequired();
          const query = {
            P_Transaccion: transaccion,
            P_Id_Usuario: 0,
            P_Usuario_Dominio: data,
            P_Nombres: "",
            P_Apellidos: "",
            P_Documento: "",
            P_Id_Tipo_Usuario: 0,
            P_Id_Rol: 0,
            P_Org_Lvl_Child: 0,
            P_Vpc_Tech_Key: 0,
            P_Skyn_Style: "",
            P_Id_Area: 0,
            P_Email: "",
            P_Clave: "",
            P_Ruta_Foto: "",
            P_Activo: 0,
            P_Usuario: ""
          };
          this.getUserOnDB(query);
        } else {
          this.isLoading = true;
          this.error = "Error: Usuario inexistente en el directorio activo.";
          this.saveButton["disabled"] = true;
          this.resetForm();
          this.disableEnableForm(false);
          setTimeout(() => {
            this.error = "";
            this.isLoading = false;
          }, 5000);
        }
      })
      .catch(error => {
        this.isLoading = true;
        this.dominioInput.nativeElement.focus();
        if (this.dominioInput.nativeElement.value === "") {
          this.error = "Debe ingresar un usuario/dominio.";
          this.saveButton["disabled"] = true;
        } else {
          this.error = "Error de comunicación: " + error.message;
          this.resetForm();
          this.disableEnableForm(false);
          this.saveButton["disabled"] = true;
        }
        setTimeout(() => {
          this.isLoading = false;
          this.error = "";
        }, 5000);
      });
  }

  resetForm() {
    this.form.get("frtipoSelect").setValue("");
    this.form.get("frProveedor").setValue("");
    this.form.get("frProveedor").disable();
    this.form.get("frtiendaSelect").setValue("");
    this.form.get("frareaSelect").setValue("");
    this.form.get("frrolSelect").setValue("");
    this.form.reset(this.form.value);
  }

  disableEnableForm(option: boolean) {
    if (option) {
      this.form.get("frtipoSelect").enable();
      this.form.get("frareaSelect").enable();
      this.form.get("frrolSelect").enable();
      this.form.get("frtiendaSelect").enable();
      this.form.get("fractivoToggle").enable();
    } else {
      this.form.get("frtipoSelect").disable();
      this.form.get("frareaSelect").disable();
      this.form.get("frrolSelect").disable();
      this.form.get("frtiendaSelect").disable();
      this.form.get("fractivoToggle").disable();
    }
  }

  setRequired(a?) {
    if (a) {
      this.form.get("frareaSelect").setValidators([RequireMatch]);
      this.form.get("frtipoSelect").setValidators([RequireMatch]);
      this.form.get("frrolSelect").setValidators([RequireMatch]);
      this.form.get("frtiendaSelect").setValidators([RequireMatch]);
    } else {
      this.form
        .get("frareaSelect")
        .setValidators([Validators.required, RequireMatch]);
      this.form
        .get("frtipoSelect")
        .setValidators([Validators.required, RequireMatch]);
      this.form
        .get("frrolSelect")
        .setValidators([Validators.required, RequireMatch]);
      this.form
        .get("frtiendaSelect")
        .setValidators([Validators.required, RequireMatch]);
    }
  }

  getUserOnDB(data) {
    this._dataService
      .setUsuario(data)
      .toPromise()
      .then(
        response => {
          if (response["Estado"] || response["Value"][0]["Código"] !== "4") {
            this.error = "";
            this.isLoading = false;
            this.usrData = { ...response["Value"][0] };
            let tipoUsuario =
              this.tipoUsuario.filter(
                s => s.ID === response["Value"][0]["ID_TIPO_USUARIO"]
              ) || null;
            let area =
              this.areas.filter(
                s => s.ID === response["Value"][0]["ID_AREA"]
              ) || null;
            let rol =
              this.roles.filter(s => s.ID === response["Value"][0]["ID_ROL"]) ||
              null;
            let tienda =
              this.tiendas.filter(
                s => s.ID === response["Value"][0]["ORG_LVL_CHILD"]
              ) || null;
            this.getUserTag(
              tipoUsuario[0],
              response["Value"][0]["VPC_TECH_KEY"]
            );

            this.form.get("frtipoSelect").setValue(tipoUsuario[0]);
            this.form.get("frareaSelect").setValue(area[0]);
            this.form.get("frrolSelect").setValue(rol[0]);
            this.form.get("frtiendaSelect").setValue(tienda[0]);

            this.activoToggle["checked"] = response["Value"][0]["ACTIVO"] === 1;
            // this.userImg = response["Value"][0]["RUTA_FOTO"];
            this.saveDisabled = true;
          } else {
            this.error = "Usuario usuario no está en la BD.";
            setTimeout(() => {
              this.error = "";
            }, 5000);
            this.transaction = "I";
            this.setRequired(1);
            this.isLoading = false;
            this.saveDisabled = true;
          }
        },
        error => {
          this.error = "Error: " + error.message;
        }
      );
  }

  closeDialog(data?) {
    this.dialogRef.close();
  }
}
