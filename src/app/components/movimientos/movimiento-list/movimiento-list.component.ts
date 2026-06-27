import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Movimiento } from '../../../models/movimiento.model';
import { Cuenta } from '../../../models/cuenta.model';
import { MovimientoService } from '../../../services/movimiento.service';
import { CuentaService } from '../../../services/cuenta.service';
import { MovimientoFormComponent } from '../movimiento-form/movimiento-form.component';

@Component({
  selector: 'app-movimiento-list',
  templateUrl: './movimiento-list.component.html',
  styleUrls: ['./movimiento-list.component.css'],
})
export class MovimientoListComponent implements OnInit, OnDestroy {
  columnas = ['fecha', 'numeroCuenta', 'tipoMovimiento', 'valor', 'saldo'];
  movimientos: Movimiento[] = [];
  cuentas: Cuenta[] = [];
  cargando = false;

  private destroy$ = new Subject<void>();

  constructor(
    private movimientoService: MovimientoService,
    private cuentaService: CuentaService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cargar(): void {
    this.cargando = true;
    forkJoin({
      movimientos: this.movimientoService.getAll(),
      cuentas: this.cuentaService.getAll(),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ movimientos, cuentas }) => {
          this.movimientos = movimientos;
          this.cuentas = cuentas;
          this.cargando = false;
        },
        error: () => (this.cargando = false),
      });
  }

  registrar(): void {
    const ref = this.dialog.open(MovimientoFormComponent, {
      width: '560px',
      data: { cuentas: this.cuentas },
    });

    ref
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((movimiento: Movimiento | undefined) => {
        if (!movimiento) {
          return;
        }
        this.movimientoService
          .create(movimiento)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.notificar('Movimiento registrado', false);
              this.cargar();
            },
            error: (err: HttpErrorResponse) => {
              // F3 - El backend responde con "Saldo no disponible".
              const mensaje = this.mensajeError(err);
              this.notificar(mensaje, true);
            },
          });
      });
  }

  private mensajeError(err: HttpErrorResponse): string {
    const cuerpo = err.error;
    if (cuerpo) {
      if (typeof cuerpo === 'string') {
        return cuerpo;
      }
      if (cuerpo.mensaje) {
        return cuerpo.mensaje;
      }
      if (cuerpo.message) {
        return cuerpo.message;
      }
    }
    return 'No se pudo registrar el movimiento.';
  }

  private notificar(mensaje: string, esError: boolean): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: esError ? 6000 : 3000,
      panelClass: esError ? ['snackbar-error'] : [],
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }
}
