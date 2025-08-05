// services/jwt-interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth-service';
import { URLService } from '../services/url-service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private urlService: URLService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip auth endpoints
    if (this.isAuthEndpoint(request.url)) {
      return next.handle(request);
    }

    const token = this.authService.getAuthToken();
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          // Handle unauthorized errors
          this.authService.logout();
        }
        return throwError(error);
      })
    );
  }

  private isAuthEndpoint(url: string): boolean {
    return url.includes(this.urlService.loginAPI) || 
           url.includes(this.urlService.signupAPI);
  }
}