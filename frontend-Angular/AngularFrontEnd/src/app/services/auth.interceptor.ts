import { HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { extractBackendErrorMessage } from '../utils/http-error.util';
import { notifyError } from './notification.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('auth_token');
  const processedReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(processedReq).pipe(
    catchError((err: any) => {
      try {
        // Network / server down (no response)
        if (err && (err.status === 0 || err.status === undefined)) {
          notifyError('El servidor no está disponible en este momento. Por favor contacte a nuestro servicio al cliente.');
          // Optionally, navigate to a dedicated 'server down' page — for now keep user where they are.
          return throwError(() => err);
        }

        // Unauthorized (possible token expiry)
        if (err && err.status === 401) {
          const message = extractBackendErrorMessage(err, 'No autorizado');
          // Show backend message if present
          notifyError(message);
          // If backend explicitly says token expired, redirect to sign-in
          const lower = String(message).toLowerCase();
          if (lower.includes('token expir') || lower.includes('token expirado') || lower.includes('token inválido') || lower.includes('no autorizado')) {
            // Clear stored token and user profile
            localStorage.removeItem('auth_token');
            try { sessionStorage.removeItem('user_profile'); } catch(e) {}
            // Redirect to sign-in page
            router.navigate(['/signin']);
          }
          return throwError(() => err);
        }

        // Generic backend-provided error payload
        if (err && err.error !== undefined && err.error !== null) {
          const message = extractBackendErrorMessage(err, 'Error en la comunicación con el servidor');
          notifyError(message);
        }
      } catch (e) {
        console.error('Error mostrando notyf o manejando error HTTP:', e);
      }

      // mark error as already notified so component-level handlers can skip duplicate notifications
      try { if (err && typeof err === 'object') (err as any)._notyfHandled = true; } catch(e) {}

      return throwError(() => err);
    })
  );
};


