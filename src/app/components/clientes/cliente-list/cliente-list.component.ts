import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

import { Cliente } from '../../../models/cliente.model';
import { ClienteService } from '../../../services/cliente.service';
import { ClienteFormComponent } from '../cliente-form/cliente-form.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-cliente-list',
  templateUrl: './cliente-list.component.html',
  styleUrls: ['./cliente-list.component.css'],
})
export class ClienteListComponent implements OnInit, OnDestroy {
  columnas = ['clienteId', 'nombre', 'identificacion', 'telefono', 'estado', 'acciones'];
  clientes: Cliente[] = [];
  cargando = false;

  private destroy$ = new Subject<void>();

  constructor(
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
    this.clienteService
      .getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.clientes = data;
          this.cargando = false;
        },
        error: () => (this.cargando = false),
      });
  }

  abrirFormulario(cliente?: Cliente): void {
    const ref = this.dialog.open(ClienteFormComponent, {
      width: '680px',
      data: { cliente },
    });

    ref
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((resultado: Cliente | undefined) => {
        if (!resultado) {
          return;
        }
        const peticion =
          cliente && cliente.clienteId != null
            ? this.clienteService.update(cliente.clienteId, resultado)
            : this.clienteService.create(resultado);
          console.log('ddd')
        peticion.pipe(takeUntil(this.destroy$)).subscribe({
          next: () => {
            this.notificar(cliente ? 'Cliente actualizado' : 'Cliente creado');
            this.cargar();
          },
        });
      });
  }

  eliminar(cliente: Cliente): void {
    if (cliente.id == null) {
      return;
    }
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        titulo: 'Eliminar cliente',
        mensaje: `¿Eliminar al cliente "${cliente.nombre}"?`,
      },
    });

    ref
      .afterClosed()
      .pipe(
        takeUntil(this.destroy$),
        switchMap((confirmado) =>
          confirmado ? this.clienteService.delete(cliente.id as number) : []
        )
      )
      .subscribe({
        next: () => {
          this.notificar('Cliente eliminado');
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
