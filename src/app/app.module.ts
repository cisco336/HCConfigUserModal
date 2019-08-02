import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatButtonModule, MatFormFieldModule, MatDialogModule, MatSelectModule, MatInputModule, MatCardModule, MatIconModule, MatSlideToggleModule, MatProgressSpinnerModule } from "@angular/material";

import { AppComponent } from "./app.component";
import { ModalComponent } from "./components/modal/modal.component";
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [AppComponent, ModalComponent],
  entryComponents: [ModalComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,

    // Angular Material
    MatButtonModule,
    MatFormFieldModule,
    MatDialogModule,
    MatSelectModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,

    HttpClientModule,
    RouterModule.forRoot([])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
