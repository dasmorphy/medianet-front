import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Cliente } from '../../models/cliente.model';
import { ReporteRegistro } from '../../models/reporte.model';
import { ClienteService } from '../../services/cliente.service';
import { ReporteService } from '../../services/reporte.service';

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css'],
})
export class ReporteComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  clientes: Cliente[] = [];
  registros: ReporteRegistro[] = [];
  columnas = [
    'Fecha',
    'Cliente',
    'NumeroCuenta',
    'Tipo',
    'SaldoInicial',
    'Estado',
    'Movimiento',
    'SaldoDisponible',
  ];
  cargando = false;
  buscado = false;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private reporteService: ReporteService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      inicio: [null, Validators.required],
      fin: [null, Validators.required],
      clienteId: ['', Validators.required],
    });

    this.clienteService
      .getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => (this.clientes = data));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get f() {
    return this.form.controls;
  }

  buscar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { inicio, fin, clienteId } = this.form.value;
    const rango = `${this.fmt(inicio)},${this.fmt(fin)}`;

    this.cargando = true;
    this.buscado = true;

    const fechaInicio = inicio.toISOString().split('T')[0];
    const fechaFin = fin.toISOString().split('T')[0];

    this.reporteService
      .getEstadoCuenta(fechaInicio, fechaFin, clienteId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.registros = data;
          this.cargando = false;
        },
        error: () => {
          this.registros = [];
          this.cargando = false;
        },
      });
  }

  limpiar(): void {
    this.form.reset({ clienteId: '' });
    this.registros = [];
    this.buscado = false;
  }

  /** Formatea una fecha a yyyy-MM-dd para el query param. */
  private fmt(fecha: Date): string {
    const d = new Date(fecha);
    const mes = `${d.getMonth() + 1}`.padStart(2, '0');
    const dia = `${d.getDate()}`.padStart(2, '0');
    return `${d.getFullYear()}-${mes}-${dia}`;
  }
}
