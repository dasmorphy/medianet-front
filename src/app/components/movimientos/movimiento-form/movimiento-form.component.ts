import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Movimiento } from '../../../models/movimiento.model';
import { Cuenta } from '../../../models/cuenta.model';

export interface MovimientoFormData {
  cuentas: Cuenta[];
}

@Component({
  selector: 'app-movimiento-form',
  templateUrl: './movimiento-form.component.html',
  styleUrls: ['./movimiento-form.component.css'],
})
export class MovimientoFormComponent implements OnInit {
  form!: FormGroup;
  // "Depósito" => Crédito (suma); "Retiro" => Débito (resta)
  operaciones = ['Depósito', 'Retiro'];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<MovimientoFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MovimientoFormData
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      numeroCuenta: ['', [Validators.required]],
      operacion: ['Depósito', [Validators.required]],
      valor: [null, [Validators.required, Validators.min(0.01)]],
    });
  }

  get f() {
    return this.form.controls;
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { numeroCuenta, operacion, valor } = this.form.value;
    const esDeposito = operacion === 'Depósito';

    const movimiento: Movimiento = {
      numeroCuenta,
      tipoMovimiento: esDeposito ? 'Crédito' : 'Débito',
      // Positivo para depósito, negativo para retiro.
      valor: esDeposito ? Math.abs(valor) : -Math.abs(valor),
    };
    this.dialogRef.close(movimiento);
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}
