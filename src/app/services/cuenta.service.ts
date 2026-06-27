import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Cuenta } from '../models/cuenta.model';

@Injectable({ providedIn: 'root' })
export class CuentaService {
  private readonly baseUrl = `${environment.cuentasApiUrl}/cuentas`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Cuenta[]> {
    return this.http.get<Cuenta[]>(this.baseUrl);
  }

  getById(id: number): Observable<Cuenta> {
    return this.http.get<Cuenta>(`${this.baseUrl}/${id}`);
  }

  create(cuenta: Cuenta): Observable<Cuenta> {
    return this.http.post<Cuenta>(this.baseUrl, cuenta);
  }

  update(numberAccount: string, cuenta: Cuenta): Observable<Cuenta> {
    return this.http.put<Cuenta>(`${this.baseUrl}/${numberAccount}`, cuenta);
  }

  patch(id: number, cambios: Partial<Cuenta>): Observable<Cuenta> {
    return this.http.patch<Cuenta>(`${this.baseUrl}/${id}`, cambios);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
