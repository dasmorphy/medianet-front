export type TipoMovimiento = 'Crédito' | 'Débito';

export interface Movimiento {
  id?: number;
  /** ISO date-time. La asigna el backend si no se envía. */
  fecha?: string;
  tipoMovimiento: TipoMovimiento;
  /** Positivo para depósito (Crédito), negativo para retiro (Débito). */
  valor: number;
  /** Saldo resultante tras el movimiento. Lo calcula el backend. */
  saldo?: number;
  numeroCuenta: string;
}
