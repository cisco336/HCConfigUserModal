import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatButtonModule, MatFormFieldModule, MatDialogModule, MatSelectModule, MatInputModule, MatCardModule, MatIconModule, MatSlideToggleModule, MatProgressSpinnerModule, MatRippleModule, MatAutocompleteModule } from "@angular/material";
import {ReactiveFormsModule} from "@angular/forms";

import { AppComponent } from "./app.component";
import { ModalComponent } from "./components/modal/modal.component";
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';

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
    MatRippleModule,
    MatAutocompleteModule,

    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot([]),

    NgSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
