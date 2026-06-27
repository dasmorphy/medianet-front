import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

import { Cuenta } from '../../../models/cuenta.model';
import { Cliente } from '../../../models/cliente.model';
import { CuentaService } from '../../../services/cuenta.service';
import { ClienteService } from '../../../services/cliente.service';
import { CuentaFormComponent } from '../cuenta-form/cuenta-form.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-cuenta-list',
  templateUrl: './cuenta-list.component.html',
  styleUrls: ['./cuenta-list.component.css'],
})
export class CuentaListComponent implements OnInit, OnDestroy {
  columnas = ['numeroCuenta', 'tipoCuenta', 'saldoInicial', 'cliente', 'estado', 'acciones'];
  cuentas: Cuenta[] = [];
  clientes: Cliente[] = [];
  cargando = false;

  private destroy$ = new Subject<void>();

  constructor(
    private cuentaService: CuentaService,
    private clienteService: ClienteService,
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
      cuentas: this.cuentaService.getAll(),
      clientes: this.clienteService.getAll(),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ cuentas, clientes }) => {
          this.cuentas = cuentas;
          this.clientes = clientes;
          this.cargando = false;
        },
        error: () => (this.cargando = false),
      });
  }

  nombreCliente(clienteId: string): string {
    const cl = this.clientes.find((c) => c.clienteId === clienteId);
    return cl ? cl.nombre : clienteId;
  }

  abrirFormulario(cuenta?: Cuenta): void {
    const ref = this.dialog.open(CuentaFormComponent, {
      width: '620px',
      data: { cuenta, clientes: this.clientes },
    });

    ref
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((resultado: Cuenta | undefined) => {
        if (!resultado) {
          return;
        }
        const peticion =
          cuenta && cuenta.numeroCuenta != null
            ? this.cuentaService.update(cuenta.numeroCuenta, resultado)
            : this.cuentaService.create(resultado);

            console.log(peticion)

        peticion.pipe(takeUntil(this.destroy$)).subscribe({
          next: () => {
            this.notificar(cuenta ? 'Cuenta actualizada' : 'Cuenta creada');
            this.cargar();
          },
        });
      });
  }

  eliminar(cuenta: Cuenta): void {
    if (cuenta.id == null) {
      return;
    }
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        titulo: 'Eliminar cuenta',
        mensaje: `¿Eliminar la cuenta N° ${cuenta.numeroCuenta}?`,
      },
    });

    ref
      .afterClosed()
      .pipe(
        takeUntil(this.destroy$),
        switchMap((confirmado) =>
          confirmado ? this.cuentaService.delete(cuenta.id as number) : []
        )
      )
      .subscribe({
        next: () => {
          this.notificar('Cuenta eliminada');
          this.cargar();
        },
      });
  }

  private notificar(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }
}
