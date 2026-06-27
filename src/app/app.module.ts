import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material.module';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ClienteListComponent } from './components/clientes/cliente-list/cliente-list.component';
import { ClienteFormComponent } from './components/clientes/cliente-form/cliente-form.component';
import { CuentaListComponent } from './components/cuentas/cuenta-list/cuenta-list.component';
import { CuentaFormComponent } from './components/cuentas/cuenta-form/cuenta-form.component';
import { MovimientoListComponent } from './components/movimientos/movimiento-list/movimiento-list.component';
import { MovimientoFormComponent } from './components/movimientos/movimiento-form/movimiento-form.component';
import { ReporteComponent } from './components/reportes/reporte.component';
import { ConfirmDialogComponent } from './components/shared/confirm-dialog/confirm-dialog.component';
import { ErrorInterceptor } from './services/error.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ClienteListComponent,
    ClienteFormComponent,
    CuentaListComponent,
    CuentaFormComponent,
    MovimientoListComponent,
    MovimientoFormComponent,
    ReporteComponent,
    ConfirmDialogComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    MaterialModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
