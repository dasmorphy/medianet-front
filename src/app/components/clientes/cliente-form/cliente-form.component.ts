import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Cliente } from '../../../models/cliente.model';

export interface ClienteFormData {
  cliente?: Cliente;
}

@Component({
  selector: 'app-cliente-form',
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.css'],
})
export class ClienteFormComponent implements OnInit {
  form!: FormGroup;
  esEdicion = false;
  generos = ['Masculino', 'Femenino', 'Otro'];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ClienteFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ClienteFormData
  ) {}

  ngOnInit(): void {
    this.esEdicion = !!this.data?.cliente;
    const c = this.data?.cliente;

    this.form = this.fb.group({
      clienteId: [c?.clienteId ?? '', [Validators.required, Validators.maxLength(20)]],
      nombre: [c?.nombre ?? '', [Validators.required, Validators.minLength(3)]],
      genero: [c?.genero ?? '', [Validators.required]],
      edad: [c?.edad ?? null, [Validators.required, Validators.min(18), Validators.max(120)]],
      identificacion: [
        c?.identificacion ?? '',
        [Validators.required, Validators.pattern(/^\d{6,15}$/)],
      ],
      direccion: [c?.direccion ?? '', [Validators.required, Validators.maxLength(120)]],
      telefono: [
        c?.telefono ?? '',
        [Validators.required, Validators.pattern(/^\d{7,15}$/)],
      ],
      password: [
        c?.password ?? '',
        this.data?.cliente ? [] : [Validators.required, Validators.minLength(4)],
      ],
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
    const resultado: Cliente = {
      ...this.data?.cliente,
      ...this.form.value,
    };
    this.dialogRef.close(resultado);
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}
