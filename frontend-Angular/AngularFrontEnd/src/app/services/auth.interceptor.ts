import { HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { notyf } from '../app';
import { extractBackendErrorMessage } from '../utils/http-error.util';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('auth_token');
  const processedReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(processedReq).pipe(
    catchError((err: any) => {
      try {
        // Only notify with backend-provided payload when server sent an `error` payload
        if (err && err.error !== undefined && err.error !== null) {
          const message = extractBackendErrorMessage(err, 'Error en la comunicación con el servidor');
          notyf.error(message);
        }
      } catch (e) {
        // Ignore notification errors
        console.error('Error mostrando notyf:', e);
      }
      return throwError(() => err);
    })
  );
};


