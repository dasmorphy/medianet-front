import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Cuenta } from '../../../models/cuenta.model';
import { Cliente } from '../../../models/cliente.model';

export interface CuentaFormData {
  cuenta?: Cuenta;
  clientes: Cliente[];
}

@Component({
  selector: 'app-cuenta-form',
  templateUrl: './cuenta-form.component.html',
  styleUrls: ['./cuenta-form.component.css'],
})
export class CuentaFormComponent implements OnInit {
  form!: FormGroup;
  esEdicion = false;
  tiposCuenta = ['AHORRO', 'CORRIENTE'];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CuentaFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CuentaFormData
  ) {}

  ngOnInit(): void {
    this.esEdicion = !!this.data?.cuenta;
    const c = this.data?.cuenta;

    this.form = this.fb.group({
      numeroCuenta: [
        c?.numeroCuenta ?? '',
        [Validators.required, Validators.pattern(/^\d{4,20}$/)],
      ],
      tipoCuenta: [c?.tipoCuenta ?? 'Ahorro', [Validators.required]],
      saldoInicial: [c?.saldoInicial ?? 0, [Validators.required, Validators.min(0)]],
      clienteId: [c?.clienteId ?? '', [Validators.required]],
      estado: [c?.estado ?? true, [Validators.required]],
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
    const resultado: Cuenta = {
      ...this.data?.cuenta,
      ...this.form.value,
    };
    this.dialogRef.close(resultado);
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}
