export type TipoCuenta = 'Ahorro' | 'Corriente';

export interface Cuenta {
  id?: number;
  numeroCuenta: string;
  tipoCuenta: TipoCuenta;
  saldoInicial: number;
  estado: boolean;
  /** Referencia lógica al cliente dueño de la cuenta. */
  clienteId: string;
}
