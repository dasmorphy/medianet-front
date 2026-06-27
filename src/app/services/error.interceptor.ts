import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * Interceptor global de errores HTTP.
 * Muestra un SnackBar con el mensaje devuelto por el backend
 * (incluyendo el error de negocio "Saldo no disponible").
 */
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private snackBar: MatSnackBar) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Si la petición pide manejar su propio error, lo dejamos pasar limpio.
    if (req.headers.has('X-Skip-Error-Handler')) {
      const limpia = req.clone({ headers: req.headers.delete('X-Skip-Error-Handler') });
      return next.handle(limpia);
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        const mensaje = this.extraerMensaje(error);
        this.snackBar.open(mensaje, 'Cerrar', {
          duration: 5000,
          panelClass: ['snackbar-error'],
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
        return throwError(() => error);
      })
    );
  }

  private extraerMensaje(error: HttpErrorResponse): string {
    if (error.error) {
      // El @RestControllerAdvice del backend retorna { mensaje, ... } o { message, ... }
      if (typeof error.error === 'string') {
        return error.error;
      }
      if (error.error.mensaje) {
        return error.error.mensaje;
      }
      if (error.error.message) {
        return error.error.message;
      }
    }
    if (error.status === 0) {
      return 'No se pudo conectar con el servidor.';
    }
    return `Error ${error.status}: ${error.statusText || 'Solicitud fallida'}`;
  }
}
