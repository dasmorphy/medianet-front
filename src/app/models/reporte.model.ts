/**
 * Registro del Estado de Cuenta (F4).
 * Coincide con la estructura JSON esperada por la prueba.
 */
export interface ReporteRegistro {
  Fecha: string;
  Cliente: string;
  NumeroCuenta: string;
  Tipo: string;
  SaldoInicial: number;
  Estado: boolean;
  Movimiento: number;
  SaldoDisponible: number;
}
