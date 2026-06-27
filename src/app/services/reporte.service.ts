import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { ReporteRegistro } from '../models/reporte.model';

@Injectable({ providedIn: 'root' })
export class ReporteService {
  private readonly baseUrl = `${environment.cuentasApiUrl}/reportes`;

  constructor(private http: HttpClient) {}

  /**
   * F4 - Estado de cuenta.
   * GET /reportes?fecha={rango}&cliente={id}
   * El rango de fechas se envía como "yyyy-MM-dd,yyyy-MM-dd".
   */
  getEstadoCuenta(inicio: string, fin: string, clienteId: string): Observable<ReporteRegistro[]> {
    console.log('reportesreportes')
    const params = new HttpParams()
      .set('fechaInicio', inicio)
      .set('fechaFin', fin)
      .set('cliente', clienteId);
    return this.http.get<ReporteRegistro[]>(this.baseUrl, { params });
  }
}
