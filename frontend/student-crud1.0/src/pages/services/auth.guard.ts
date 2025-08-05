// services/auth.guard.ts
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth-service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Use the observable from AuthService for reactive authentication state
    return this.authService.isAuthenticated$().pipe(
      take(1), // Take only the first value and complete
      map(isAuthenticated => {
        if (isAuthenticated) {
          return true; // User is authenticated, allow access
        }
        
        // User is not authenticated, redirect to login page
        // Save the attempted URL for redirecting after login
        return this.router.createUrlTree(
          ['/students/login'],
          { queryParams: { returnUrl: state.url } }
        );
      })
    );
  }
}