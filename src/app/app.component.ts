import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ModalComponent } from "./components/modal/modal.component";
import { Overlay } from "@angular/cdk/overlay";
import "hammerjs";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  constructor(public dialog: MatDialog, public overlay: Overlay) {}
  ngOnInit() {
    this.openDialog();
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      data: { disableClose: true, data: "data" },
      panelClass: ["HC-dialog", "mat-elevation-z10"]
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log("result: ", result);
    });
  }
}
