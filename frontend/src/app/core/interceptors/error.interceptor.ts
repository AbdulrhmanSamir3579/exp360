import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, retry, throwError, timer } from 'rxjs';

/**
 * Error Interceptor
 * Intercepts HTTP requests and handles errors globally.
 * Implements retry logic for server errors (5xx).
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    // Retry 2 times with a delay for 5xx errors
    retry({
      count: 2,
      delay: (error: HttpErrorResponse, retryCount: number) => {
        // Only retry for server errors (500-599)
        if (error.status >= 500 && error.status < 600) {
          console.warn(`[Interceptor] Retrying request ${req.url} (Attempt ${retryCount})...`);
          return timer(1000 * retryCount); // Exponential backoff: 1s, 2s
        }
        return throwError(() => error);
      }
    }),
    catchError((error: HttpErrorResponse) => {
      if (error.status >= 500) {
        console.error('[Interceptor] Server Error:', error);
        // You could inject a ToastService here to show a notification
        // const toast = inject(ToastService);
        // toast.show({ type: 'error', title: 'Server Error', message: 'Something went wrong on the server.' });
      }
      return throwError(() => error);
    })
  );
};
