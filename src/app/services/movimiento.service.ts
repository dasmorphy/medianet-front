import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Movimiento } from '../models/movimiento.model';

/** Cabecera que indica al ErrorInterceptor que NO muestre el SnackBar genérico,
 *  porque el componente maneja el error de forma específica (F3). */
export const SKIP_ERROR_HANDLER = 'X-Skip-Error-Handler';

@Injectable({ providedIn: 'root' })
export class MovimientoService {
  private readonly baseUrl = `${environment.cuentasApiUrl}/movimientos`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Movimiento[]> {
    return this.http.get<Movimiento[]>(this.baseUrl);
  }

  getById(id: number): Observable<Movimiento> {
    return this.http.get<Movimiento>(`${this.baseUrl}/${id}`);
  }

  /**
   * Registra un nuevo movimiento. Si el backend responde con un error de
   * negocio ("Saldo no disponible") el error se propaga al componente.
   */
  create(movimiento: Movimiento): Observable<Movimiento> {
    const headers = new HttpHeaders().set(SKIP_ERROR_HANDLER, 'true');
    return this.http.post<Movimiento>(this.baseUrl, movimiento, { headers });
  }

  update(id: number, movimiento: Movimiento): Observable<Movimiento> {
    return this.http.put<Movimiento>(`${this.baseUrl}/${id}`, movimiento);
  }

  patch(id: number, cambios: Partial<Movimiento>): Observable<Movimiento> {
    return this.http.patch<Movimiento>(`${this.baseUrl}/${id}`, cambios);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
