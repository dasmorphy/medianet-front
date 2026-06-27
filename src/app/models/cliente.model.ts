/**
 * Cliente hereda de Persona en el backend.
 * El frontend lo modela como una única interfaz plana.
 */
export interface Cliente {
  id?: number;
  clienteId: string;
  nombre: string;
  genero: string;
  edad: number;
  identificacion: string;
  direccion: string;
  telefono: string;
  password: string;
  estado: boolean;
}
